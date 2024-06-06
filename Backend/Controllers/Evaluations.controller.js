//----- DATA BASE ----- //
const DataBase = require('../Model/DataBase.js');
const database = new DataBase(() => {
    console.log('\nConexion establecida desde el controlador Evaluations');
});

 
class Evaluation 
{

    constructor(docId,employeeId,month,pos)
    {
        this.docId = docId;
        this.employeeId = employeeId;
        this.month = month; 
        this.pos = pos;
        this.sql = this.strSqlEvalsByPosition();
        
   
    }

    findEvaluations(){
        console.log('function findEvaluations');
        database.query(this.sql, (e)=>{console.log(e);})
        .then((result) => {
            //console.log(result);
            return result;
            if (result != undefined) {

              if (result.rowsAffected[0] > 0 || result.rowsAffected[3] > 0) {

                console.log('Bono VTA');

                const bonoVtas = result.recordsets[1];
                console.log(bonoVtas);
                const bonoBud = result.recordsets[2];
                const aditonals = result.recordsets[3];/* agregar a esta variable: si existen las ventas*/
                const sales = result.recordsets[4];
                const needViewFormSales = result.recordsets[5].length > 0;// determina si el usuario que consulta necesita ver el formalario de captura de ventas  
                const isBonoProductividad = result.recordset[0].bonoType.trim() == 'Bono Productividad'
                const needViewFormExpenses = result.recordsets[5].length > 0 && !isBonoProductividad;// determina si el usuario que consulta necesita ver el formalario de captura de gastos

                console.log('ver formularios ? ');
                console.log(needViewFormExpenses, '-' , needViewFormSales);

                let response = {};

                try {

                  let percentage = 0

                  if (bonoVtas[0] != undefined && bonoVtas[0].percentage != undefined) {
                    percentage = bonoVtas[0].percentage;
                  }

                  response = {
                    status: 'success',
                    mensaje: `se encontraron ${result.recordset.length} evaluaciones`,
                    data: result.recordset,
                    bonoVta: [],
                    bonoBud: [],
                    aditionals: aditonals,
                    sales: sales,
                    percentage
                  };
                } catch (e) {
                  console.log('no se pudo crear la estructura de la respuesta', e);
                }

                //si el empleado es un contralor mandamos sxi ese documento requiere establecer gastos y ventas 
                console.log(`Puesto del usuario '${req.usuario.userId}': `);
                console.log(pos);

                if (pos == 20) {
                  response.bonoVta = bonoVtas;
                  response.bonoBud = bonoBud;
                  response.needViewFormExpenses = needViewFormExpenses;
                  response.needViewFormSales = needViewFormSales; 
                }

                res.send(response);
              }
              else {
                res.send({ status: 'error', mensaje: `se encontraron ${result.recordset.length} evaluaciones` });

              }
            }
          })
          .catch((error) => {
            'Error al ejecutar el query: ', error
          })
    }

    /**
     * crea la cadena sql para obtener las evaluaciones pertenecientes a un evaluador 
     * @param {*} docId id del documento
     * @param {*} employeeId empleado evaluado
     * @param {*} month mes de evaluacion 
     * @param {*} pos puesto del evaluador 
     */
    strSqlEvalsByPosition()
    {

        const sql = 
          `select 
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
        and d.documentId = ${this.docId}
        and em.employeeID = ${this.employeeId}
        and month ( e.monthToEvaluate ) = ${this.month}
        and e.posEvaluator = ${this.pos}
        and e.finishDate IS NULL
        and dt.typeId = d.documentType
        and e.employeeId = em.employeeID
        and em.position = p.positionID
        and c.activityId = da.activityId

      order by da.activityId asc, c.criteriaId asc;
      
      --validamos si el documento tiene bono por ventas
      select * from documentSales
      where documentId = ${this.docId} 
      and posEvaluator = ${this.pos};

      --validamos si tiene bono por presupuesto 
      select 
        ee.monthAchieve bMonthAchieve, 
		    ee.monthGoal bMonthGoal,
		    ee.accumulatedAchieve bAccumulatedAchieve,
		    ee.accumulatedGoal bAccumulatedGoal,
        *,  ( es.monthAchieve * e.percentage ) / 100 impcom  from expenses e, evaluationExpenses ee, evaluationSales es
      where e.documentId = ${this.docId}
      and e.documentId = ee.documentId
      and ee.employeeId = ${this.employeeId}
      and month(ee.monthEvaluated) = ${this.month}
      and es.documentId = e.documentId	
	    and es.monthEvaluated = ee.monthEvaluated
	    and es.employeeId = ee.employeeId;
      
      select *, dt.description typeDesc , ab.description adDescription from aditionalBonos ab, documents d, documentType dt, employees e, positions p
			where ab.documentId = ${this.docId}
      and ab.documentId = d.documentId
      and posEvaluator = ${this.pos}
      and d.documentType = dt.typeId
      and e.employeeID = ${this.employeeId}
      and p.positionID = e.position;

      select * from evaluationSales
      where employeeId = ${this.employeeId}
      and documentId = ${this.docId};

      select * from documentSales
      where documentId = ${this.docId};

      select * from expenses
      where documentId = ${this.docId};

      `;

      console.log('se construyo el sql: \n', sql );
      return sql; 
    }



}

module.exports = Evaluation;