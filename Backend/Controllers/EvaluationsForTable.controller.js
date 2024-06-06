class EvaluationsForTable {

    static databaseInstance;

    static main(req, res) {
        EvaluationsForTable.req = req;
        EvaluationsForTable.res = res;

        switch(req.usuario.type)
        {
            case 'evalu': {
                const sql = `SELECT * FROM Users where userName = '${req.usuario.userId}'`;
                console.log(sql);
                console.log('Evaluador');
                EvaluationsForTable.evaluationsEvalu()
            }
            break; 
            
            case 'admin':
                console.log('Administrador');
                EvaluationsForTable.evaluationsAdmin()
            break;
        }

    }

    static evaluationsAdmin(){
        console.log("evaluaciones para admin");

    const sql =
      `select  
              ev.evalId,
              ev.employeeId, 
              em.name,  
              monthToEvaluate, 
              posEvaluated numPosEvaluated, 
              p1.posName posNameEvaluated,
              ev.posEvaluator numPosEvaluator, 
			        p2.posName posNameEvalutor,
              d.documentId,
              d.nomenclature,
              ev.activityId,
              da.description,
              ev.finishDate,
              d.docDepartment
            from 
              evaluations ev, 
              positions p1,
              positions p2, 
              employees em,
              DocumentActivity da,
              Documents d
            where ev.posEvaluated = p1.positionID
            and ev.employeeId = em.employeeID
            and ev.activityId = da.activityId
            and da.documentId = d.documentId
            and ev.posEvaluator = p2.positionID`;

    EvaluationsForTable.databaseInstance.query(sql)
      .then((result) => {
        if (result.rowsAffected > 0) {
          EvaluationsForTable.res.send({ status: 'success', message: 'se encontraron evaluaciones', data: result.recordset });
        }

        else {
            EvaluationsForTable.send({ status: 'error', message: 'no se encontraron las evaluaciones' })
        }
      }).catch((e) => {
        console.log('sucedio un error al ejecutar la consulta', e);
      })
    }

    static createSqlEvaluationsEvalu(pos){
        const sql =
        `select  
            ev.evalId,
            ev.employeeId, 
            em.name,  
            monthToEvaluate, 
            posEvaluated numPosEvaluated, 
            p1.posName posNameEvaluated,
            ev.posEvaluator numPosEvaluator, 
            p2.posName posNameEvalutor,
            d.documentId,
            d.nomenclature,
            ev.activityId,
            da.description,
            ev.finishDate,
            d.docDepartment
        from 
          evaluations ev, 
          positions p1,
          positions p2, 
          employees em,
          DocumentActivity da,
          Documents d
        where ev.posEvaluated = p1.positionID
        and ev.employeeId = em.employeeID
        and ev.activityId = da.activityId
        and da.documentId = d.documentId
        and ev.posEvaluator = p2.positionID
        and ev.posEvaluator  = ${pos}`;

        return sql; 
    }

    static searchEvaluEvaluations(){

        const sql2 = EvaluationsForTable.createSqlEvaluationsEvalu(EvaluationsForTable.pos);

        console.log(sql2)

        EvaluationsForTable.databaseInstance.query(sql2)
            .then((result) => {
                console.log("then")
                console.log(result)
                if (result.rowsAffected[0] > 0) {
                    console.log("se encontraron actividades para ese puesto");
                    const resp = {
                        status: "success",
                        message: "se encontraron actividades para ese puesto",
                        data: result.recordset,
                    };
                    console.log('Se encontraron registros, enviando...');
                    EvaluationsForTable.res.send(resp)
                }
                
                else {
                    console.log('No se encontraron registros');
                }
            })
            .catch((error) => {
                console.log("sucedio un error al buscar las activities");
                console.log(error);
                EvaluationsForTable.res.send({ status: "error" })
            })
    }

    static evaluationsEvalu() {

            const sql = `SELECT * FROM Users where userName = '${EvaluationsForTable.req.usuario.userId}'`;
            console.log(sql);

            EvaluationsForTable.databaseInstance.query(sql, (e)=>{console.log(e);})
                .then((result) => {
                    if (result) {
                        EvaluationsForTable.pos = result.recordset[0].position;
                        EvaluationsForTable.searchEvaluEvaluations();
                    }
                })
                .catch((error) => {
                    console.log("sucedio un error al buscar el usuario",error   );
                })

        }
    }

    module.exports = EvaluationsForTable;