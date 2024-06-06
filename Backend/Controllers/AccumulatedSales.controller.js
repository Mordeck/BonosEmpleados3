const DataBase = require('../Model/DataBase.js')
const database = new DataBase(()=>{});

class AccumulatedSales {
      static getAllStoresSales(req, res){
        console.log('getAllStoresSales');
        const month = req.query.month;
        const employeeId = req.query.employeeId;

        
        if (!month === undefined){
        }
        else
        {
            console.log('el parametro month si esta definido', month);
            res.send('petición inadecuada')
            return
        }
        
        if (!employeeId === undefined){
        }
        else {
            console.log('el parametro employeeId si esta definido', employeeId);
            res.send('petición inadecuada')
            return; 
        }


        const sql = 
        `
        select sum(monthAchieve) cumulatedSales from evaluationSales
            where employeeId = ${employeeId}
            and month(monthEvaluated) <= ${month}
            and year(monthEvaluated) = year(GETDATE())

        `;

        console.log(sql);
        database.query(sql,(e)=>{console.log(e);}).then((r)=>{
            if(r){
                console.log(r);
                res.send({status:'success', message:'Se encontraron ventas', data:r.recordset})
            }
            else {
                console.log('error no se ecnontraron las ventas');
            }
        })
    }
}

module.exports = AccumulatedSales; 