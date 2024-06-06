const DataBase = require('../Model/DataBase.js')
const database = new DataBase(() => { });

class SalesBonusController {
    static getSalesBonus(req, res) {
    console.log('******* /salesBonus -controller');
    const documentId = req.query.documentId;

    if (!documentId){
        res.send({status:'error', message:'No se eviaron los parametros correctamente "Documento": ' + documentId});
        return;
    }

    const sql =
        `select * from documentSales
    where documentId = ${documentId}`;

    database.query(sql, (e) => { console.log(e) }).then((r) => {
        if (r) {
            const response = { status: '', message: '', data: '' }
            response.status = 'success'
            response.message = 'Se encontraron los bonos por venta';
            response.data = r.recordset;
            res.send(response);
        }
    }).catch((e)=>{
        const response = { status: '', message: '', data: '' }
        response.status = 'error'
        response.message = 'Sucedio un error al ejecutar la consulta';
        res.send(response);
    })

}
}

module.exports = SalesBonusController; 