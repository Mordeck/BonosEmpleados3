class EvaluationSummary {
    static databaseInstance; 
    static response = {};

    static main(req,res){
        EvaluationSummary.req = req;
        EvaluationSummary.res = res;
        EvaluationSummary.getDocumentAverage();
    }

    static getDeductions(){
        console.log('getDeductions');
        const req = EvaluationSummary.req; 
        const documentId = req.query.documentId;
        const employeeId = req.query.employeeId;
        const month = req.query.month; 

        const sql = `
        select * from documentDeductions d, evaluationDeductions e
        where d.docDeductionId = e.docDeductionId
        and employeeId = ${employeeId}
        and month(evaluatedMonth) = ${month}
        and d.documentId = ${documentId}`;

        console.log(sql);

        EvaluationSummary.databaseInstance.query(sql,(e)=>{console.log({message:e.message, function:'getDeductions'});})
        .then((r)=>{
            if(r){
                EvaluationSummary.response.deductions = r.recordset;
                console.log('Enviando respuesta');
                EvaluationSummary.response.status = 'success';
                EvaluationSummary.res.send(EvaluationSummary.response);
            }
            else {
                console.log('No se encontraron las deducciones');
            }
        }).
        catch((e)=>{
            console.log('Error en la ejecusión del sql: ', sql);
        })
    }

    static getAditionals(){
        console.log('getAditionals');
        const req = EvaluationSummary.req; 
        const documentId = req.query.documentId;
        const employeeId = req.query.employeeId;
        const month = req.query.month; 

        const sql = `select * from aditionalBonos a, evalAditionalBono e
                    where a.adBonoId = e.adId
                    and  e.employeeId = ${employeeId}
                    and a.documentId = ${documentId}
                    and month(e.evalDate) = ${month}`;

        console.log(sql);

        EvaluationSummary.databaseInstance.query(sql, (e)=>{console.log({message:e.message, function:'getAditionals'});})
        .then((r)=>{
            if(r){
                EvaluationSummary.response.aditionals = r.recordset; 
                EvaluationSummary.getDeductions();
            }else{
                console.log('No se encontraron bonos adicionales');
            }
        }).
        catch((e)=>{
            console.log('Error en la ejecusión del sql: ', sql);
        })

    }

    static getDocumentAverage(){
        console.log('getDocumentAverage');
        const req = EvaluationSummary.req; 
        const documentId = req.query.documentId;
        const employeeId = req.query.employeeId;
        const month = req.query.month; 

        const sql = `select * from DocumentBonoAuth ba, documents d
                     where d.documentId = ${documentId}
                     and d.documentId = ba.documentId
                     and employeeId = ${employeeId}
                     and month(monthEvaluated) = ${month}`;

        console.log(sql);

        EvaluationSummary.databaseInstance.query(sql, (e)=>{console.log({message:e.message, function:'getDocumentAverage'});})
        .then((r)=>{
            if (r){
                EvaluationSummary.response.documentAverageData = r.recordset;
                EvaluationSummary.getAditionals();
            }else {
                console.log('No se se encontraron los promedios del documento');
            }
        }).
        catch((e)=>{
            console.log('Error en la ejecusión del sql: ', sql);
        })
    }
}

module.exports =  EvaluationSummary; 