class DocumentFinalAuth {
    static databaseInstance; 
    static main (req,res){
        DocumentFinalAuth.req = req;
        DocumentFinalAuth.res = res;
        DocumentFinalAuth.getUserPosition(DocumentFinalAuth.searchByPosition)//cuando tengamos el puesto buscamos las autorizaciones
        
    }

    static getUserPosition(callback){
        const userName = DocumentFinalAuth.req.usuario.userId; 
        const sql = `select * from users where userName = '${userName}'`;
        DocumentFinalAuth.databaseInstance.query(sql, (e)=>{console.log(e.message);})
        .then((r)=>{
            if(r){
                const userData = r.recordset[0];
                callback(userData.position);
            }
        })
    }


    static searchByPosition(position){
        console.log(position);
        const documentId = DocumentFinalAuth.req.query.documentId;
        const sql = `select * from DocumentfinalAuth 
                     where documentId = ${documentId}
                     and positionEvaluator = ${position}`;
        DocumentFinalAuth.databaseInstance.query(sql,(e)=>{console.log({message:e.message, function:'searByPosition', sql:sql});})
        .then((r)=>{
            if(r){
                const response = {};
                response.status = 'success'
                response.message = 'Se encontró autorización final para este documento'
                response.DocumentFinalAuth = r.recordset;
                DocumentFinalAuth.res.send(response)
            }
            else {
                const response = {};
                response.status = 'error';
                response.message = 'No se encontró autorización final par este documento';
                DocumentFinalAuth.res.send(response)
            }
        })
    }
}

module.exports =  DocumentFinalAuth; 