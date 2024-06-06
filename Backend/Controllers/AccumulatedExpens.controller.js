
class AccumulatedExpensController {
      static databaseInstance; 
      static getAllStoresExpens(req, res){
        console.log('getAllStoresExpens');
        const month = req.query.month;
        const employeeId = req.query.employeeId;

         
        if (!month === undefined){
        }
        else
        {
            console.log('el parametro month si esta definido', month);
            //res.send({status:'sucess', message:'petición inadecuada'})
            return
        }
        
        if (!employeeId === undefined){
        }
        else {
            console.log('el parametro employeeId si esta definido', employeeId);
            res.send({status:'error', message:'petición inadecuada'})
            return; 
        }

        const sql = 
        `
        select sum(monthAchieve) cumulatedExpens from evaluationExpenses
            where employeeId = ${employeeId}
            and month(monthEvaluated) <= ${month}
            and year(monthEvaluated) = year(GETDATE())

        `;

        console.log(sql);
        AccumulatedExpensController.databaseInstance.query(sql,(e)=>{console.log(e);}).then((r)=>{
            if(r){
                console.log(r);
                res.send({status:'success', message:'Se encontraron gastos', data:r.recordset})
            }
            else {
                console.log('error no se encontraron los gastos');
            }
        })
    }
}

module.exports = AccumulatedExpensController; 