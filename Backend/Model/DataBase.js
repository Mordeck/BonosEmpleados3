const sqlServer = require('mssql');
const bcrypt = require('bcryptjs');

// Configuration for your SQL Server
const config = {
  user: 'wavNoi',
  password: '_M4sterWavNoi2017**',
  server: 'WDWGDLME5NZ91\\MASTER', // You can use 'localhost' if SQL Server is on your local machine
  database: 'BonosPlacencia',
  trustServerCertificate: true
};

class Database 
{
    constructor(callback)
    {
        this.connect(callback);
        
    }

    /**
     * Conexion simple  la base de datos 
     */
    async connect(callback) 
    {
        sqlServer.connect(config)
        .then((e)=>{
            console.log("\nSe establecio la conexión a la BD");
            this.dbconnection = sqlServer;
            if (callback != undefined){
                callback();
            }
        })
        .catch((e)=>{
            console.log("No se pudo conectar a la base de datos: ", e); 
        })
    }

    /**
     * Encriptación de los passwords
     */
    encryptPass(password, callback)
    {
        console.log("\n---Encryptando", password);
        const saltRounds = 10; // Number of salt rounds, higher is more secure but slower
        bcrypt.genSalt(saltRounds, function(err, salt) 
            {
                bcrypt.hash(password, salt, function(err, hash) 
                {
                    if (err) throw err;
                    callback(hash);
                });
            });   
    }

    /**
     * Consultas
     * @param {*} sql 
     */
    async query(sql,onError)
    {   
        try {
            let result = await this.dbconnection.query(sql);
            return result; 
        } catch (error) {
            //console.log("No se pudo ejecutar el sql \n", error);
            
            if ( onError != undefined ) 
            {
                onError(error);
            }
        }
    }

    async queryWithTemplate(template, onError) {
        try {
            // Construct the SQL query using the template and values
            console.log('Consultando con :' , template.text );
            console.log('Parametros con :' , template.values);
            console.log('Type:' , typeof sqlServer.Int);

              // Create an array of input parameters using the .input method
            const inputs = template.values.map((value, index) => {
                return  { name: `param${index + 1}`, value:value } // 
            });



            console.log("******************",inputs);
    
            let result = await this.dbconnection.query(template, ...inputs);
    
            return result;
        } catch (error) {
            // Handle errors
            console.error("Error executing SQL query:", error);
    
            if (onError !== undefined) {
                onError(error);
            }
        }
    }

    /**
     * Consultas
     * @param {*} sql 
     */
    async rollbackQuery(sql,onError)
    {  
        const pool = new sqlServer.ConnectionPool(config);

        await pool.connect();

        const transaction = new sqlServer.Transaction(pool);

        try {

            await transaction.begin();

            let result = await transaction.request().query(sql);

            await transaction.commit();

            return result; 

        } catch (error) 
        {
            console.log("No se pudo ejecutar el sql \n", error);
            console.log('Haciendo rollback');

            await transaction.rollback();
            
            if ( onError != undefined ) 
            {
                onError(error);
            }
        }
    }

    async checkPass(pass,hash)
    {
        //console.log("-----------  CheckPass ----------");
        //console.log("comparando los datos", pass, " y ", hash);
        return await bcrypt.compare(pass,hash);
    }

}

module.exports = Database;