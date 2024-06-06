class ActivityConditionController {
    
    static databaseInstance;

    static start(req,res){
        ActivityConditionController.setParams(req,res);
        ActivityConditionController.searchCondition(ActivityConditionController.update,
                                                    ActivityConditionController.saveDataActivityCondition)
        
    }

    static update(req,res){
        console.log('actualizando el registro');
        const uSql = `update evalActivityCondition 
                        set userAuth = '${ActivityConditionController.userAuth}',
                            authDate = getDate(),
                            finalAmount = ${ActivityConditionController.finalAmount},
                            criteriaId = ${ActivityConditionController.criteriaId}
                        where conditionId = ${ActivityConditionController.conditionId}
                        and employeeId = ${ActivityConditionController.employeeId}
                        and evalMonth = '${ActivityConditionController.evalMonth}'
                        `;
        ActivityConditionController.databaseInstance.query(uSql,(e)=>{console.log(e);}).then((r)=>{
            if(r){
                if (r.rowsAffected[0]>0){
                    console.log('Se actualizó el registro');
                    const response = { status: 'success', message:'Se actualizó el registro' };
                    ActivityConditionController.res.send(response)
                }
            }
        })
    }
    
    static setParams(req,res)
    {
        console.log('Estableciendo párametros');
        ActivityConditionController.conditionId = req.body.conditionId;
        ActivityConditionController.finalAmount = req.body.finalAmount;
        ActivityConditionController.evalMonth   = req.body.evalMonth;
        ActivityConditionController.userAuth    = req.usuario.userId;
        ActivityConditionController.employeeId  = req.body.employeeId;
        ActivityConditionController.criteriaId  = req.body.criteriaId;
        ActivityConditionController.req  = req;
        ActivityConditionController.res  = res;
    }

    static saveDataActivityCondition(req,res)
    {
        console.log('insertando registro');
        const iSql = `insert into evalActivityCondition values (
            ${ActivityConditionController.conditionId},
            ${ActivityConditionController.finalAmount},
            '${ActivityConditionController.evalMonth}',
            '${ActivityConditionController.userAuth}',
            getDate(),
            ${ActivityConditionController.employeeId},
            ${ActivityConditionController.criteriaId}
        )`;

        console.log(iSql);
        ActivityConditionController.databaseInstance.query(iSql, (e)=>{
            console.log('error en sql', e);
        }).then((r)=>{
            if(r){
                console.log('se ejecuto correctamente el sql');
                if(r.rowsAffected[0]>0){
                    const response = {status:'success', message:'Se agregó la información'}
                    ActivityConditionController.res.send(response)
                }
            }
        }).catch((e)=>{
            console.log(e);
        })
    }

    static searchCondition(whenFound,whenNotFound)
    {
        console.log('Buscando el registro');
        let found = false; 

        const sSql = `select * from evalActivityCondition
                        where conditionId = ${ActivityConditionController.conditionId}
                        and employeeId = ${ActivityConditionController.employeeId}
                        and evalMonth = '${ActivityConditionController.evalMonth}'`;
        
        console.log(sSql);
        ActivityConditionController.databaseInstance.query(sSql).then((r)=>{
            if (r)//si se ejecuta bien el sql 
            {
                if ( r.rowsAffected[0] > 0 ){
                    found = true;
                    console.log('Si se encontro el registro');
                    whenFound()
                } 
                else {
                    console.log('no hay registro');
                    whenNotFound()
                }
            }
        });

        return found; 
    }
}

module.exports = ActivityConditionController;