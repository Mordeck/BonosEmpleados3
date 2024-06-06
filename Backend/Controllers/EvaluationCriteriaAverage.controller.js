class EvaluationCriteriaAverageController {

    static databaseInstance; 
    
    static setDataBaseInstance(databaseInstance){
      EvaluationCriteriaAverageController.databaseInstance = databaseInstance;
    }

    static saveEvalCriteriaAverage(req,res){
        const documentId     = req.body.documentId
        const employeeId     = req.body.employeeId
        const monthEvaluated =new Date().getFullYear().toString() + '-' + (1).toString().padStart(2,'0') + '-01';
        const average        = req.body.average;
        const authorized     = req.body.authorized;
        const userAuth       = req.usuario.userId; 
        const criteriaId     = req.body.criteriaId;
        const evalId     = req.body.evalId;

        const sql = `insert into evalCriteriaAverage values ( ${documentId},
                                                              ${employeeId}, 
                                                              '${monthEvaluated}', 
                                                              ${average},
                                                              '${authorized}',
                                                              '${userAuth}',
                                                              getDate(),
                                                              ${criteriaId},
                                                              ${evalId})`
                                                              ;
        console.log(sql);
        EvaluationCriteriaAverageController.databaseInstance.query(sql,(e)=>{ console.log('error en sql', e );
      if (e.number === 2627 ){
        console.log('Actualizando el registro');
        const sql2 = `update evalCriteriaAverage set authorized = '${authorized}' where 
        documentId = ${documentId}
        and employeeId =  ${employeeId}
        and userAuth = '${userAuth}'
        and monthEvaluated =  '${monthEvaluated}'`;
        
        console.log(sql2);

        EvaluationCriteriaAverageController.databaseInstance.query(sql2).then((res.send({status:'success', message:'El registro ya existía, se actualizó'})))
        return;
      }
      }).then( (r)=>{
            if (!!r){
                res.send({status:'success', message:'Se agrego el registro' });
            }
        } )
    }
}

module.exports = EvaluationCriteriaAverageController;