class EvaluationsQueryController {
    static databaseInstance;

    //punto principal
    static main(req, res) {
        console.log('main');

        //estableciendo miembros 
        EvaluationsQueryController.setParams(req, res);

        const sqlUserData = `SELECT * FROM Users where userName = '${req.usuario.userId}'`;
        let userData;

        EvaluationsQueryController.databaseInstance.query(sqlUserData, (e) => { console.log('error en sql', e); })
            .then((result) => {
                if (result) {
                    userData = result.recordset;
                    console.log('Se obtuvieron los datos del usuario', userData);
                    console.log('Buscando evaluaciones para el usuario: ', EvaluationsQueryController.typeUser);
                    try {

                        switch (EvaluationsQueryController.typeUser) {
                            case 'evalu':
                                EvaluationsQueryController.sendDocByEvaluator(req, res)
                                break;

                            case 'admin':
                                EvaluationsQueryController.sendWholeDocs(req, res);
                                break;

                            default:
                                break;
                        }
                    } catch (error) {
                        console.log(error);
                    }

                }
            });




    }
    /**
 * devuelve la cadena de la consulta dependiendo del usuario que consulta y el documento 
 * @param {*} documentEval documento que se va a evaluar 
 * @param {*} employeeId  empleado a evaluar
 * @param {*} month  mes a evaluar 
 */
    static crateSqlStringToGetExpensesData(documentEval, employeeId, month, pos) {
        console.log('crateSqlStringToGetExpensesData\n');
        const BP_VTA_01 = 13; //documento de control de inventarios para gerentes de tienda
        const BP_VTA_18 = 1014; // documento de bono de productividad para gerentes de tienda   
        let sql = "";

        documentEval = parseInt(documentEval);

        switch (documentEval) {
            case BP_VTA_18:
                console.log('Se esta evaluando el BP_VTA_18(1014)(Bono de control de inventarios para gerentes de tienda)\n');
                sql = `
      select
        e.expensId,
	      e.description,
        ee.monthAchieve bMonthAchieve, 
		    ee.monthGoal bMonthGoal,
		    ee.accumulatedAchieve bAccumulatedAchieve,
		    ee.accumulatedGoal bAccumulatedGoal,
         ( es.monthAchieve * e.percentage ) / 100 impcom ,
         'Ventas' headerType --usado para determinar el tipo de encabezado en la tabla en el front-end
		  from expenses e, 
		    evaluationExpenses ee, 
		    evaluationSales es
      where e.documentId = ${documentEval}
        and e.documentId = ee.documentId
        and ee.employeeId = ${employeeId}
        and month(ee.monthEvaluated) = ${month}
  	    and es.documentId = ${BP_VTA_01}
	      and es.monthEvaluated = ee.monthEvaluated
	      and es.employeeId = ee.employeeId;
  	  `;
                console.log('Obteniendo los bonos adicionales de presupuesto de gastos con el sql: \n', sql);
                break;

            case BP_VTA_01:
                console.log('Se esta evaluando el BP_VTA_01(13) Bono de productividad para gerentes de tiendas');
                sql = ` 
      select 
        *, 
        ( es.monthAchieve * e.percentage ) / 100 impcom  ,
        'Gastos' headerType,
        ee.monthAchieve bMonthAchieve,
        ee.monthGoal bMonthGoal,
		    ee.accumulatedAchieve bAccumulatedAchieve,
		    ee.accumulatedGoal bAccumulatedGoal
      from 
        expenses e, 
        evaluationSales es, 
        evaluationExpenses ee
      where e.documentId = 13
      and es.documentId = e.documentId 
      and es.employeeId = ${employeeId}
      and month(es.monthEvaluated) = ${month}
      and ee.employeeId = es.employeeId
      and ee.documentId = ${BP_VTA_18}
      `;

                //agregamos al condicion del evaluador para cuando el usuario no es el admin
                if (pos) {
                    sql += `\nand posEvaluator = ${pos}\n`
                }

                break;

            default:
                sql = `select top 1 'NoEvaluationsForThisUser' error from users  `; // esta linea es para que la funcion siempre retorne una consulta aun que el comportamiento para ese documento, esto para para que no halla problema en los indices a la hora de construir la respuesta para evalQuery
                console.log('No se puede buscar si tiene bonos adicionales por presupuesto ya que no se ha definido comportamiento para el documentoId:', documentEval);

                break;

        }
        return sql;
    }

    static setParams(req, res) {
        EvaluationsQueryController.typeUser = req.usuario.type;
        EvaluationsQueryController.docId = req.query.docId;
        EvaluationsQueryController.month = req.query.month;
        EvaluationsQueryController.employeeId = req.query.employeeId;
        EvaluationsQueryController.res = res;
        EvaluationsQueryController.response = {
            data: [], //los registros de las evaluaciones (actividades, criterios)
            aditionals: []
        };
    }



    static sendWholeDocs(req, res) {
        console.log('enviando los documentos sin retriccion del puesto (solo para admins)');

        //console.log(sqlUserData);

        const sql =
            `
          --Query #1
          select 
            *, 
            da.description aDescription,
            c.description cDescription  
          from evaluations e 
            join DocumentActivity da  
              on e.activityId = da.activityId
            left join criteriasEvaluation ce
              on e.evalId = ce.evalId
            left join criterias c
              on c.criteriaId = ce.criteriaId
            left join positions p
              on p.positionID = e.posEvaluator
            left join evalCriteriaAverage eca
              on e.evalId = eca.evalId
          where e.employeeId = ${EvaluationsQueryController.employeeId}
            and month ( monthToEvaluate ) = ${EvaluationsQueryController.month}
            and da.documentId = ${EvaluationsQueryController.docId}

            --Query #2 
            --validamos si el documento tiene bono por ventas
            select * from documentSales
            where documentId =  ${EvaluationsQueryController.docId}

            --Query #3
            --validamos si tiene bono por presupuesto 
            ` + EvaluationsQueryController.crateSqlStringToGetExpensesData(EvaluationsQueryController.docId, EvaluationsQueryController.employeeId, EvaluationsQueryController.month) + `

          --Query #4
          select *, 
                  dt.description typeDesc , 
                  ab.description adDescription 
                from aditionalBonos ab, 
                     documents d, 
                     documentType dt, 
                     employees e, 
                     positions p
			    where ab.documentId = ${EvaluationsQueryController.docId}
          and ab.documentId = d.documentId
          and d.documentType = dt.typeId
          and e.employeeID = ${EvaluationsQueryController.employeeId}
          and p.positionID = e.position;

          --#Query #5
          select * from documentSales 
          where documentId = ${EvaluationsQueryController.docId}

          --Query #6 determinando la necesidad de formularios
          select needSalesCapture, needExpensCapture from documents 
          where documentId = ${EvaluationsQueryController.docId};

          --Query #7 datos del empleado evaluado 
          select * from employees e, positions s
          where employeeID = ${EvaluationsQueryController.employeeId}
          and e.position = s.positionID

          --Query #8 datos del documento
          select * from documents d, documentType dt 
          where documentId = ${EvaluationsQueryController.docId}
          and d.documentType = dt.typeId;

          --Query #9 busca
          select * from evalCriteriaAverage
          where documentId = ${EvaluationsQueryController.docId}
          and employeeID = ${EvaluationsQueryController.employeeId}
          and month ( monthEvaluated ) = ${EvaluationsQueryController.month};

          --Query #10 actividades condicionantes 
          select * from activityConditions
          where documentId = ${EvaluationsQueryController.docId}

          --Query #11 
          SELECT *
          FROM conditionCriterias
          WHERE conditionId = (SELECT conditionId FROM activityConditions WHERE documentId = ${EvaluationsQueryController.month});

          --Query 12 trae los datos de importe autorizacion y promedio 
          select * from DocumentBonoAuth
          where documentId = ${EvaluationsQueryController.docId}
          and employeeId = ${EvaluationsQueryController.employeeId}
          and month(monthEvaluated) = ${EvaluationsQueryController.month}

          --Query 13  
          select * from evalActivityCondition e, DocumentBonoAuth d, conditionCriterias c
          where d.employeeId = e.employeeId
          and d.monthEvaluated = e.evalMonth
          and month(d.monthEvaluated) = ${EvaluationsQueryController.month}
          and e.employeeId = ${EvaluationsQueryController.employeeId}
          and d.documentId = ${EvaluationsQueryController.docId}
		      and c.conditionId = e.conditionId
		      and e.criteriaId = c.condCriteriaId;

          --Query 14 deducciones del documento 
          select * from documentDeductions 
          where documentId = ${EvaluationsQueryController.docId}
          


`;

        console.log(sql);

        EvaluationsQueryController.databaseInstance.query(sql, (e) => { console.log('error en sql', e); })
            .then((result) => {
                console.log('se ejecuto la consulta principal');
                if (result) {

                    EvaluationsQueryController.response.documentDeductions = result.recordsets[13][0];
                    EvaluationsQueryController.response.bonoVta = result.recordsets[1];
                    EvaluationsQueryController.response.bonoBud = result.recordsets[2];
                    EvaluationsQueryController.response.data = result.recordsets[0];
                    EvaluationsQueryController.response.aditionals = result.recordsets[3];
                    EvaluationsQueryController.response.status = 'success';
                    EvaluationsQueryController.response.evaluatedUser = result.recordsets[6][0];
                    EvaluationsQueryController.response.documentData = result.recordsets[7][0];
                    EvaluationsQueryController.response.criteriaAverages = result.recordsets[8][0];
                    EvaluationsQueryController.response.conditions = { condition: result.recordsets[9][0], criterias: result.recordsets[10] };
                    EvaluationsQueryController.response.bonoDocument = result.recordsets[11][0];
                    EvaluationsQueryController.response.conditionsSaved = result.recordsets[12][0];


                    //los datos del tipo de bono adicional por ventas 
                    const docSaleData = result.recordsets[4];

                    if (docSaleData.length > 0) {
                        console.log('El documento tiene bono por ventas ');

                        const typeDocSales = docSaleData[0].typeSales;//tipo de ventas 

                        console.log('el tipo de venta del documento es', typeDocSales);

                        let sqlSales = '';
                        // las ventas son globales o de una tienda ?
                        switch (typeDocSales.trim()) {

                            case 'store':
                                console.log('se requieren las ventas por tiendas');
                                sqlSales = `
                    select *, (monthAchieve * percentage)/100 impcom, 'store' type from documentSales ds, evaluationSales es 
                    where ds.documentId =  ${EvaluationsQueryController.docId}  
                    and es.documentId = ds.documentId  
                    and es.employeeId = ${EvaluationsQueryController.employeeId}`;
                                break;

                            case 'global':
                                console.log('se requieren las ventas globales');
                                sqlSales = `
                      select 
                      SUM(monthAchieve)       monthTotalSales , 
                            SUM(monthGoal)          monthGoalSales, 
                            SUM(accumulatedAchieve) totalCumullated, 
                            SUM(accumulatedGoal)    totalCumulatedGoal
                      from evaluationSales e, positions p, employees em
                      where month(e.monthEvaluated) = ${EvaluationsQueryController.month}
                      and year(e.monthEvaluated)= year(getDate())
                      and e.employeeId = em.employeeID
                      and em.position = p.positionID
                      and em.position in ( 
                        21,	--Gerente Federalismo                                         
                        1024,	--Gerente León                                                
                        1026,	--Gerente Urban                                               
                        1027,	--Gerente Puebla                                              
                        1028,	--Gerente Querétaro                                           
                        1029,	--Gerente López EvaluationsQueryController.month     
                        1030,	--Gerente Irapuato                                            
                        1031	--Gerente Patria               
                        );
                        `
                                break;

                            default:
                                console.log('No se reconoce el tipo de ventas');
                                console.log(docSaleData);
                                break;

                        }

                        EvaluationsQueryController.databaseInstance.query(sqlSales, (e) => { console.log('Error en la consulta de ventas'); }).then((r) => {
                            if (r) {
                                console.log();
                                EvaluationsQueryController.response.sales = r.recordset;
                                EvaluationsQueryController.res.send(EvaluationsQueryController.response);

                            }
                            else {
                                r.send({ status: 'error', message: 'No de pudo obtener las ventas' })
                            }
                        })

                    }
                    {
                        console.log('el documento no tiene bono por ventas');
                        EvaluationsQueryController.res.send(EvaluationsQueryController.response)
                    }

                }
                else { EvaluationsQueryController.res.send({ status: 'error', mensaje: `se encontraron ${result.recordset.length} evaluaciones` }); }
            }
            )
            .catch((error) => {
                'Error al ejecutar el query: ', error
            })
    }

    static sendAdminEvaluations(){
        console.log('function sendAdminEvaluations ');
        const sqlAdminEvaluations = EvaluationsQueryController.getAdminEvaluationsQuery();
    }

    

    static getAdminEvaluationsQuery(){
        console.log('Generando sql para evaluaciones');
        const sql = `
                select 
                    e.evalId,
                    dt.description bonoType, 
                    d.docDepartment, 
                    e.monthToEvaluate, 
                    d.nomenclature,
                    p.posName,
                    da.activityId,
                    da.description actDescription ,
                    c.criteriaId,
                    c.TypeCriteria,
                    c.description cDescription,
                    em.name, 
                    em.employeeId,
                    c.weighting
                from 
                    evaluations e, 
                    DocumentActivity da, 
                    Documents d, 
                    documentType dt, 
                    criterias c, 
                    employees em,
                    positions p 
                where e.activityId = da.activityId
                  and d.documentId = da.documentId
                  and d.documentId = ${EvaluationsQueryController.docId}
                  and em.employeeID = ${EvaluationsQueryController.employeeId}
                  and month ( e.monthToEvaluate ) = ${EvaluationsQueryController.month}
                  and e.posEvaluator = ${pos}
                  and e.finishDate IS NULL
                  and dt.typeId = d.documentType
                  and e.employeeId = em.employeeID
                  and em.position = p.positionID
                  and c.activityId = da.activityId
                order by da.activityId asc, c.criteriaId asc;`;
                console.log(sql);
                return sql; 
    }

    /**
    * los datos a evaluar dependiendo del puesto del usuario que consulta
    */
    static sendDocByEvaluator(req, res) {
        console.log('Buscando las evaluaciones por evaluador\n');

        const sqlUserData = `select * from users 
                            where userName = '${req.usuario.userId}'`;

        console.log(sqlUserData);

        EvaluationsQueryController.databaseInstance.query(sqlUserData, (e) => { console.log(e); })
            .then((result) => {
                if (result != undefined) {
                    //console.log(result)  

                    const pos = result.recordset[0].position;

                    const sql =
                        `--Query #1 evaluaciones
          select 
            e.evalId,
            dt.description bonoType, 
	          d.docDepartment, 
	          e.monthToEvaluate, 
	          d.nomenclature,
	          p.posName,
            da.activityId,
	          da.description actDescription ,
            c.criteriaId,
            c.TypeCriteria,
	          c.description cDescription,
            em.name, 
            em.employeeId,
            c.weighting
      from 
	      evaluations e, 
	      DocumentActivity da, 
	      Documents d, 
	      documentType dt, 
	      criterias c, 
	      employees em,
	      positions p 
      where e.activityId = da.activityId
        and d.documentId = da.documentId
        and d.documentId = ${EvaluationsQueryController.docId}
        and em.employeeID = ${EvaluationsQueryController.employeeId}
        and month ( e.monthToEvaluate ) = ${EvaluationsQueryController.month}
        and e.posEvaluator = ${pos}
        and e.finishDate IS NULL
        and dt.typeId = d.documentType
        and e.employeeId = em.employeeID
        and em.position = p.positionID
        and c.activityId = da.activityId
      order by da.activityId asc, c.criteriaId asc;
      
      --Query #2 
      --validamos si el documento tiene bono por EvaluationsQueryController.monthentas
      select *, (monthAchieve * percentage)/100 impcom from documentSales ds, evaluationSales es 
      where ds.documentId =  ${EvaluationsQueryController.docId}
      and es.documentId = ds.documentId 
      and es.employeeId = ${EvaluationsQueryController.employeeId}
      and posEvaluator= ${pos}

      --Query #3
      --validamos si tiene bono por presupuesto 
      ` + EvaluationsQueryController.crateSqlStringToGetExpensesData(EvaluationsQueryController.docId, EvaluationsQueryController.employeeId, EvaluationsQueryController.month, pos) + `
      
      --Query #4 BONOS ADICIONALES
      select *, dt.description typeDesc , ab.description adDescription from aditionalBonos ab, documents d, documentType dt, employees e, positions p
			where ab.documentId = ${EvaluationsQueryController.docId}
      and ab.documentId = d.documentId
      and posEvaluator = ${pos}
      and d.documentType = dt.typeId
      and e.employeeID = ${EvaluationsQueryController.employeeId}
      and p.positionID = e.position;

      --#Query #5
      select * from evaluationSales
      where employeeId = ${EvaluationsQueryController.employeeId}
      and documentId = ${EvaluationsQueryController.docId};

      --Query #6 determinando la necesidad de formularios
      select needSalesCapture, needExpensCapture from documents 
      where documentId = ${EvaluationsQueryController.docId};

      --Query #7 datos del empleado evaluado 
      select * from employees e, positions s
      where employeeID = ${EvaluationsQueryController.employeeId}
      and e.position = s.positionID

      --Query #8 datos del documento
      select * from documents d, documentType dt 
      where documentId = ${EvaluationsQueryController.docId}
      and d.documentType = dt.typeId

      --Query #9 CONDICIONES
      select * from activityConditions
      where documentId = ${EvaluationsQueryController.docId}
      and positionEvaluator = ${pos};


      --Query #10
      SELECT *
      FROM conditionCriterias
      WHERE conditionId = (SELECT conditionId FROM activityConditions WHERE documentId = ${EvaluationsQueryController.docId});

      --Query #11 promedio bono y autorizados 
      select * from DocumentBonoAuth
      where documentId = ${EvaluationsQueryController.docId}
      and employeeId = ${EvaluationsQueryController.employeeId}
      and month(monthEvaluated) = ${EvaluationsQueryController.month}

      --Query 12 evaluaciones de condicionantes
          select 
            e.conditionId,
	        finalAmount,
	        evalMonth,
	        e.userAuth,
	        e.authDate, 
	        e.employeeId,
	        criteriaId,
	        average,
	        authorized,
	        condCriteriaId,
	        c.description,
	        c.weighting
         from 
            evalActivityCondition e, 
            DocumentBonoAuth d, 
            conditionCriterias c
          where d.employeeId = e.employeeId
          and d.monthEvaluated = e.evalMonth
          and month(d.monthEvaluated) = ${EvaluationsQueryController.month}
          and e.employeeId = ${EvaluationsQueryController.employeeId}
          and d.documentId = ${EvaluationsQueryController.docId}
		      and c.conditionId = e.conditionId
		      and e.criteriaId = c.condCriteriaId;
    
      --Query 13 deducciones del documento 
      select * from documentDeductions 
      where documentId = ${EvaluationsQueryController.docId}
      and positionEvaluator = ${pos}

      --Query 14 deducciones evaluadas 
      select * from evaluationDeductions
      where month(evaluatedMonth) = ${EvaluationsQueryController.month}
      and employeeId = ${EvaluationsQueryController.employeeId}
      and docDeductionId = 1;

      --Query 15 Las evaluacionaes de los bonos adicionales
      select * from evalAditionalBono e, aditionalBonos a
      where a.adBonoId = e.adId
      and documentId = ${EvaluationsQueryController.docId}
      and employeeId = ${EvaluationsQueryController.employeeId}
      and month(evalDate) = ${EvaluationsQueryController.month}


      `;

                    //console.log(sql);

                    EvaluationsQueryController.databaseInstance.query(sql, (e) => { console.log('Error en la consulta', e); })
                        .then((result) => {
                            console.log('Se ejecuto correctamente el sql de evaluaciones\n');
                            if (result != undefined) {
                                const CONTRALOR = 20;
                                const formsDataArray = result.recordsets[5];
                                const formDocumentData = formsDataArray[0]; // formularios
                                const intNeedExpensCapture = formDocumentData.needExpensCapture;
                                const intNeedSalesCapture = formDocumentData.needSalesCapture;
                                const needViewFormExpenses = !!intNeedExpensCapture;
                                const needViewFormSales = !!intNeedSalesCapture;
                                const response  = EvaluationsQueryController.response;//alias
                                response.status = 'success';
                                response.needViewFormExpenses = needViewFormExpenses && pos == CONTRALOR; //solo el contralor debe ver los formularios
                                response.needViewFormSales = needViewFormSales && pos == CONTRALOR; //solo el contralor debe ver los formularios
                                
                                response.data = result.recordsets[0];
                                response.bonoVta = result.recordsets[1];
                                response.bonoBud = result.recordsets[2];
                                response.aditionals = result.recordsets[3];
                                response.sales = result.recordsets[4];
                                response.evaluatedUser = result.recordsets[6][0];
                                response.documentData = result.recordsets[7][0];
                                response.conditions = { condition: result.recordsets[8][0], criterias: result.recordsets[9] };
                                response.bonoDocument = result.recordsets[10][0];
                                response.conditionsSaved = result.recordsets[11][0];
                                response.documentDeductions = result.recordsets[12];
                                response.evaluatedDeductions = result.recordsets[13];
                                response.aditionalsEvaluated = result.recordsets[14];
                                res.send(response);
                            }
                            else {
                                EvaluationsQueryController.res.send({ status: 'error', mensaje: `se encontraron ${result.recordset.length} evaluaciones` });
                            }
                        }
                        )
                        .catch((error) => {
                            console.log('Error al ejecutar el query: ', error);
                        })

                }
            })
    }
}

module.exports = EvaluationsQueryController;