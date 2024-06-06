class DeductionsController {
    static databaseInstance; 
    static response = {};

    static setPostParams(req, res){
        console.log(req.query);
        DeductionsController.req = req;
        DeductionsController.res = res;
        DeductionsController.docDeductionId = req.body.docDeductionId ;
        DeductionsController.totalAmount = req.body.totalAmount;
        DeductionsController.employeeId = req.body.employeeId;
        DeductionsController.evaluatedMonth = req.body.evaluatedMonth;
        DeductionsController.userAuth = req.usuario.userId ;
    }

    static setGetParams(req, res){
        console.log('Query:',req.query);
        DeductionsController.req = req;
        DeductionsController.res = res;
        DeductionsController.docDeductionId = req.query.docDeductionId ;
        DeductionsController.totalAmount = req.query.totalAmount;
        DeductionsController.employeeId = req.query.employeeId;
        DeductionsController.evaluatedMonth = req.query.month;
        DeductionsController.userAuth = req.usuario.userId ;
    }

    static main (req,res)
    {

        switch(req.method){
            case 'POST':
                console.log('POST');
                DeductionsController.setPostParams(req,res);
                DeductionsController.saveDeduction();
                break; 
                
            case 'GET':
                console.log('GET');
                DeductionsController.setGetParams(req,res)
                DeductionsController.getEvaluatedDeduction()
            break; 
        }
    }

    static getEvaluatedDeduction()
    {
        const docDeductionId = DeductionsController.docDeductionId; 
        const employeeId =  DeductionsController.employeeId
        const evaluatedMonth = DeductionsController.evaluatedMonth; 
        const sql = 
        `select * from evaluationDeductions
        where month(evaluatedMonth) = ${evaluatedMonth}
        and employeeId = ${employeeId}
        and docDeductionId = ${docDeductionId}`;

        console.log(sql);

        const response = {};

        DeductionsController.databaseInstance.query(sql,(e)=>{console.log(e);}).
        then((r)=>{
            if (r){
                response.status = 'success'
                response.message = 'se encontraron deducciones evaluadas'
                response.data = r.recordset; 
                DeductionsController.res.send(response)
            }
            else {
                response.status = 'error'
                response.message = 'No se pudieron encontrar deducciones evaluadas'
                DeductionsController.res.send(response)
            }
        })
    }

    static createFullDateBaseNumberMonth(numberMonth){
        const year = new Date().getFullYear().toString();
        const month = numberMonth.toString().padStart(2,'0');
        const fullDate = `${year}-${month}-01`;
        return fullDate;
    }

    static saveDeduction()
    {
        const evaluatedDate = DeductionsController.createFullDateBaseNumberMonth(DeductionsController.evaluatedMonth)
        const sql = `insert into evaluationDeductions values (
        ${DeductionsController.docDeductionId },
        ${DeductionsController.totalAmount },
        ${DeductionsController.employeeId },
        '${ evaluatedDate }',
        '${DeductionsController.userAuth }',
        getDate()
        )`

        console.log(sql);

        if (DeductionsController.databaseInstance){
            DeductionsController.databaseInstance.query(sql, (e)=>{
                if(e.number = 2627){
                    DeductionsController.response.status = 'error';
                    DeductionsController.response.message = 'Ya existe un registro'
                    console.log('Intento de inserción duplicado');}
                })
                .then((r)=>{
                    if(r){
                        console.log('Se agrego la deducción');
                        DeductionsController.response.status = 'success';
                        DeductionsController.response.message = 'Se agrego la deducción'
                    } 
                    else
                    {
                        console.log('No se pudo agregar la deducción');
                        DeductionsController.response.status = 'error';
                        DeductionsController.response.message = 'No se pudo agregar la deducción'
                    }
            })

        }

        DeductionsController.res.send(DeductionsController.response)
    }
}

module.exports = DeductionsController;