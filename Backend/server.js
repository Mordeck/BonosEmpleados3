const express = require('express');
const session = require('express-session');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const DataBase = require('./Model/DataBase.js');
const { error, log } = require('console');
const ScheduledTaskManager = require('./ScheduledTaskManager.js')
const scheduledTaskManager = new ScheduledTaskManager.ScheduledTaskManager();
const { SQL } = require('sql-template-strings');
const AccumulatedSales = require('./Controllers/AccumulatedSales.controller.js')
const AccumulatedExpens = require('./Controllers/AccumulatedExpens.controller.js')
const SalesBonusController = require('../Backend/Controllers/SalesBonusController.controller.js')
const EvaluationCriteriaAverageController = require('../Backend/Controllers/EvaluationCriteriaAverage.controller.js')
const ActivityConditionController = require('../Backend/Controllers/ActivityCondition.controller.js')
const EvaluationsQueryController = require('../Backend/Controllers/EvaluationsQuery.controller.js')
const DeductionsController = require('../Backend/Controllers/DeductionsController.js')
const EvaluationsForTable = require('../Backend/Controllers/EvaluationsForTable.controller.js');
const DocumentFinalAuth = require('./Controllers/DocumentFinalAuth.controller.js');
const EvaluationSummary = require('./Controllers/EvaluationSummary.controller.js')
//jwt token secret 
const secret = 'Mu3Bl3sPl4c#nc1a';

console.clear();

//----- DATA BASE ----- //
const database = new DataBase(() => {
  //console.log("el callback de la BD");
  //const generateEvaluations = new ScheduledTaskManager.GenerateEvaluations(database);
  //1 = lunes 
  //scheduledTaskManager.addTask({ task: generateEvaluations, schedule: { day: 1 } });
  //scheduledTaskManager.RunTasksChecker(1000 * 60 * 60);
});


//*************************************************** TOKEN ******************************************************/
function validToken(req, res, next) {
  console.log("\n--------- token ---------");
  console.log("URL: ", req.url.split('%20')[0]);

  if (req.headers['authorization']) {

    let token = req.headers.authorization.split(' ')[1]; // Extract token from the cookie named 'authorization'    
    token = token.split(',')[0];
    //console.log("\ntenemos el token", token);


    if (!token) {
      console.log('no hay token')
      return res.status(401).json({ mensaje: 'Acceso no autorizado' });
    }

    jwt.verify(token, secret, (error, usuario) => {
      if (error) {
        console.log("sucedio un error al validar token", token);
        console.log(error);
        return res.status(403).json({ mensaje: 'Token inválido', error: error, usuario: usuario });
      }

      //console.log("Token correcto para el usuario", usuario);
      req.usuario = usuario; // Guardar la información del usuario en el objeto de solicitud
      //   console.log('los encabezados son: ');
      //   console.log(req.headers)
      next();
    });
  }
  else {
    console.log('falta el encabezado de \'authorization\'')
    console.log(req.headers);
    res.status(403).send({ status: "error", message: "No autorizado" });
  }
}

// --------------------------------Puerto del servidor  
const port = 4201;

const app = express();

const allowedOrigins = ['http://10.20.1.57:4200', 'http://10.20.1.57:4300'];


app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(bodyParser.json());

app.use(cookieParser());

app.listen(port, '10.20.1.57', () => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  console.log("\n\nServidor ejecutandose en el puerto: ", port, " ", timeZone);

});

//-------------------------------- ingreso del usuario -------------------------------
app.post('/auth', (req, res) => {
  console.log("\n---------- auth ----------");
  let user = req.body.user;
  let pass = req.body.pass;

  const date = new Date(); // Replace this with your date

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-based
  const day = String(date.getDate()).padStart(2, '0');

  const today = `${year}-${month}-${day}`;

  checkCredential(user, pass, {
    next: result => {
      if (result) {
        const type = result.recordset[0].type;
        const token = jwt.sign({ userId: user, type: type }, secret, { expiresIn: '2h' });

        jwt.verify(token, secret, (error, usuario) => {
          console.log("error: ", error);
          console.log("user: ", usuario);
          console.log("token: ", token);
        }
        )

        database.query(`update users set lastAccess = '${today}' where userName = '${user}'`);

        const sql = `select * from module where userType = '${type}'`;
        let permissions;

        database.query(sql).then(result => {
          //console.log("los modulos del usuario son" );
          permissions = result;
          responseData = {
            status: "success",
            message: "usuario encontrado",
            userData: { userName: user, userType: type },
            token: token,
            permissions: permissions
          };
          res.status(200).json(responseData);
        })

          .catch((error) => {
            console.log("No se pudo ejecutar la consulta");
          })



        /*
        console.log("firmando al usuario", { userId: user, type:userData.type })
        let permissions = getPermissions(userData);
        */
      }
    },

    error: result => {
      const message = "Las credenciales otorgadas no son las correctas "
      console.log(message);
      res.send({ status: "error", message: message });
    }
  });
});


/**
 * Devuelve el componente hijo en base al tipo de usuario
 */
app.get('/tabs', validToken, (req, res) => {
  console.log("query", req.query);
  const user = req.query.user;
})


//**--------------- validando la contraseña ------------- */
function checkCredential(userInput, pass, { next: nextF, error: errorF }) {
  //console.log("--------------- checkCredential -------------");
  //console.log("Buscando el usuario: ", userInput, " conla contraseña: ", pass);
  searchUser(userInput, {
    next: (result) => {
      //console.log("Next:", result)

      if (result.rowsAffected != 0) {
        //console.log("colocando el argumento", result.recordset[0].userName);
        const userName = result.recordset[0].userName;
        //console.log("el objeto que se esta poniendo en compare es:", { user: userName, pass: pass });

        comparePass({ user: userName, pass: pass },
          {
            next: (result) => {
              //console.log("afirmo pass correcto", result);
              nextF(result);
            },

            error: (result) => {
              //  console.log("confirmo pass no es el correcto");
              errorF(result);

            }
          })

      }

      else {
        console.log("No se encontro ese usuario");
        errorF({ status: "error", message: "No se encontro el usuario" });
      }

    },

    error: (error) => {
      console.log("Error:", error)
    }

  });


  return null;
}

app.get('/document_detail', validToken, (req, res) => {
  console.log("-------- Detail --------");
  const docId = req.query.docId;
  let details = searchDocDetail(docId);
  res.send({ status: "success", details: details });
});


/**----------------------------------- Usuarios ---------------------------------------- */
app.get('/user', validToken, (req, res) => {
  console.log("-------- user -------");
  const sql = `SELECT *  , FORMAT(u.fCreacion, 'dd/MM/yyyy') creadoEn FROM Users u, departments d, positions p
  WHERE active = 1
  AND department = d.departmentID
  and p.departmentId = d.departmentID
  and p.positionID = u.position`;

  database.query(sql).then(
    (result) => {
      //console.log(result);
      res.send(result)
    }
  ).catch((error) => { res.send(error) });
});

app.post('/updateUser', validToken, (req, res) => {
  console.log('\n********************* PUT user ************');
  console.log(req.body);


  let name;
  let number;
  let dep;
  let type;
  let pass;
  let pos;

  try {

    name = req.body.name;
    number = req.body.number;
    dep = req.body.department;
    type = req.body.type;
    pass = req.body.pass;
    pos = req.body.pos;

  } catch (e) {
    console.log('no se pudó obtener los valores');
    console.log(e);
  }

  pass = database.encryptPass(pass, (encryp) => {
    const sql = `update users set userName = '${name}', numEmp = ${number}, type = '${type}', pass = '${encryp}', department = '${dep}', position = '${pos}' where userName = '${name}'`
    console.log(sql);

    database.query(sql).then((result) => {
      if (result.rowsAffected > 0) {
        res.send({ status: 'success', message: 'Se actualizo' });
      }

      else {
        res.send({ status: 'error', message: 'no se pudio actualzar el usuario' });
      }
    })
      .catch((error) => {
        console.log('no se pudo ejecutar el sql ', error);
      })


  })




});


app.delete('/user', validToken, (req, res) => {
  console.log('DEL -------- user -------');
  console.log("solicitante", req.usuario);

  if (req.usuario.type != "admin") {
    res.send({ status: "error", message: "no cuentas con los prilegios" });
    return;
  }

  let userDel = req.body.userToDel;

  console.log("Eliminando el usuario", userDel);
  res.send({ status: "sucess", message: "usuario eliminado", usuario: userDel });

  updateSql = `update Users set active = 0 where userName = \'${userDel}\'`;

  console.log("Se ejecutará el siguiente sql", updateSql);

  database.query(updateSql)
    .then((result) => {
      console.log("el resultado de la eliminacion", result)
    })
    .catch((error) => {
      console.log("error eliminando el usuario:\n", error)
    })
});

app.post('/NewUser', validToken, (req, res) => {
  console.log('\n------- NewUser -------');
  let respuesta;
  if (req.usuario.type != "admin")
    res.send({ status: "error", message: "no cuentas con los prilegios" });

  if (!req.body.pass) {
    res.send({ status: "error", message: "error en la petición falta la contraseña en el cuerpo", body: req.body });
    return;
  }

  let hash = database.encryptPass(req.body.pass, (hash) => {
    const date = new Date(); // Replace this with your date

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-based
    const day = String(date.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    const sql = `insert into Users values ( '${req.body.userName}', ${req.body.numEmp}, '${req.body.type}', '${hash}', '${formattedDate}', null , 1,  ${req.body.department}, ${req.body.position} )`;
    console.log("sql:", sql);


    database.query(sql, (error) => {
      //console.log("***** el error es: ", error)
      console.log("***** el number: ", error.number)

      respuesta = { status: "error", message: error.originalError };
      res.send(respuesta);


    }).then(
      (result) => {
        console.log("usuario insertado", result)
        respuesta = { status: "success", message: "Usuario insertado" };
        res.send(respuesta)
        return;
      }
    )
      .catch((error) => {
        console.log("no se pudo insertar el usuario", error);
        respuesta = { status: "error", message: "No se pudo ingresar el usuario" };
      })

    console.log("la respuesta final es:", respuesta);
  });

});

/**----------------------------------- User type ---------------------------------------- */
app.get('/roles', validToken, (req, res) => {
  console.log("-------- ROLES --------");
  if (req.usuario.type == 'admin') {
    database.query("select * from roles").then(
      result => { res.send(result) }
    ).catch((error) => { res.send("No se pudieron obtener los roles", error) })
  }

})

function searchDocDetail(docID) {
  let details = [];

  for (let i = 0; i < docdetails.length; i++) {
    if (docdetails[i].docId == docID) {
      details.push(docdetails[i]);
    }
  }

  return details;
}

function searchUser(user, { next: nextF, error: errorF }) {
  //console.log("-------------- searchUser --------------");

  const sql = `select * from users where userName = '${user}' and active = 1`;

  //console.log(sql);

  database.query(sql)
    .then(result => { nextF(result) })
    .catch(error => { errorF(error) })
}

function comparePass({ user, pass }, { next: nextF, error: errorF }) {
  //console.log("comparePass");
  //console.log(`Buscando la contraseña del usuario ${user}`);
  const sql = `select * from users where userName = '${user}' and active = 1 `;
  database.query(sql).then(
    (userData) => {
      //console.log("Los datos devueltos por la BD", userData);
      database.checkPass(pass, userData.recordset[0].pass).then(
        (result) => {
          if (result) {
            //console.log("la contraseña otorgada es correcta", result);
            nextF(userData);
          }

          else {
            //console.log("La contraseña es incorrecta --", result);
            errorF(result);
          }
        }
      )
        .catch(
          (result) => {
            //console.log("contraseña incorrecta", result);
            errorF(result);
          }
        )
    }
  );
}

function getPermissions(user) {
  let pArr = [];
  for (let i = 0; i < permissions.length; i++) {
    if (permissions[i].userType == user.type) {
      //console.log("objeto permission antes de icon",permissions[i]);
      let icon = getIcon(permissions[i].view);
      permissions[i].icon = icon
      //console.log("objeto permission despues de icon",permissions[i]);
      pArr.push(permissions[i]);
    }
  }
  return pArr;
}







function milisToDate(ms) {
  const date = new Date(ms);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months are 0-based, so add 1
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// agregando un nuevo documento 
app.post('/document', validToken, (req, res) => {
  console.log('------------------ document ------------------');

  if (req.usuario.type == 'admin') {
    const nomenclature = req.body.nomenclature;
    const department = req.body.department.trim();
    const bonoType = req.body.bonoType;
    const position = req.body.position;
    const dupla = req.body.dupla;

    let posIds = "";

    if (position !== undefined) {

      console.log('los puestos son :');
      console.log(req.body.position)
      console.log("la longitud es")
      console.log(req.body.position.length)

      //se concantenan los IDs para agregarlos a un solo campo
      for (let i = 0; i < position.length; i++) {
        posIds += position[i].positionID + ',';
      }

      posIds = posIds.substring(0, posIds.length - 1)
    }

    const user = req.usuario;
    const date = new Date();
    const year = date.getFullYear();
    const month2 = date.getMonth() - 1;
    const day = date.getDate();
    const dateDoc = `${year}-${month2}-${day}`;

    console.log(position);

    const sql = `insert into documents values ( '${nomenclature}', '', 0, '${user.userId}', '${dateDoc}', '${department
      }', '${posIds}', 1, ${bonoType}, '${dupla}')`;

    console.log("el sql");
    console.log(sql);

    database.query(sql)
      .then((result) => {
        console.log("en el insert");
        console.log(result);

        if (result.rowsAffected > 0) {
          res.send({ status: "success", message: "Se Agrego el documento" });
        }

        else {
          res.send({ status: "error", message: "No se pudo agregar el documento" });
        }
      })

      .catch(error => {
        console.log("error en el insert");
        console.log(error);
        res.send({ status: "error", message: "No se pudo agregar el documento" });
      })

  }

  else res.send({ status: "error", message: "no cuentas con los privilegios para agregar documentos" })

})

app.post('/updateDocument', validToken, (req, res) => {
  console.log("********************************************** /updateDocument **********************************************");
  const doc = req.body.documentData;
  console.log(doc);

  let userPositions = doc.userPosition;
  let docType = doc.docType;
  let nomenclature = doc.nomenclature;
  let documentId = doc.documentId;

  let idPositions = '';

  userPositions.forEach((position) => {
    idPositions += position.positionID + ',';
  });

  console.log('antes');
  console.log(idPositions);

  idPositions = idPositions.substring(0, idPositions.length - 1);

  console.log('despues');
  console.log(idPositions);



  const sql = `update documents set userPosition = '${idPositions}', documentType = ${docType}, nomenclature = '${nomenclature}' where documentId = ${documentId}`;

  console.log(sql);


  database.query(sql, (error) => { console.log(error); }).
    then((result) => {
      console.log(result);
      if (result != undefined) {
        if (result.rowsAffected[0] > 0) {
          res.send({ status: 'success', message: 'se actualizo el documento' })
        }
        else {

          res.send({ status: 'error', message: 'No se pudo actualizar el documento' })
        }
      }

    }).catch((error) => {
      console.log('error en el sql ', error);
    })



});


app.delete('/document', validToken, (req, res) => {
  console.log("DEL --- document ----");

  if (req.usuario.type == 'admin') {
    const docId = req.body.documentId;
    console.log("eliminando el docid: ", docId);

    const updSql = `update documents set active = 0 where documentId = ${docId}`

    database.query(updSql).then(
      result => {
        console.log("el resultado del sql");
        console.log(result);
        if (result.rowsAffected > 0) {
          res.send({ status: "success", message: "Se ha actualizado correctamente el documento" });
        }
      }
    )
      .catch(error => { console.log("error en update"); })
  }
})

app.get('/document', (req, res) => {
  console.log('GET --- document --');

  const sql = `select 
	d.documentId,
	nomenclature,
	t.description,
	s.salesId,
	evalMonth,
	completed,
	userRegister,
	dateRegister,
	docDepartment,
	userPosition,
	active,
	documentType,
	multiEmployee,
	typeId,
	departmentID,
	departName,
	ex.expensId,
  d.minimunToAuth
from Documents d
	left join 
	documentType t on  d.documentType = t.typeId
	join departments dep
	on dep.departName = d.docDepartment
	left join documentSales s
	on d.documentId = s.documentId
	left join expenses ex 
	on d.documentId = ex.documentId
	where d.active != 0
`;

  console.log(sql);

  database.query(sql, (e) => { console.log('SqlError', e); })
    .then(result => {
      res.send({ status: "success", data: result.recordset })
    })
})


/**
 * Funcion para enviar los documentos cuando el usuario es un evaluador
 */
function sendEvalDocuments(req, res)
{
  console.log('userType "evalu"');
  const user = req.usuario;


  if (user.type == 'evalu') {
    const sqlUserData =
      `select * from users where userName = '${user.userId}'`;

    console.log(sqlUserData);

    database.query(sqlUserData)
      .then((result) => {
        if (result != undefined) {

          if (result.rowsAffected[0] > 0) {
            console.log(result.recordset);

            const pos = result.recordset[0].position;
            const sql =
              `
              -- documentos con criterios basicos #1
              select 
                distinct d.documentId, 
                nomenclature, 
                d.docDepartment, 
                count(da.activityId) cantActivities, 
                p.posName
              from 
                DocumentActivity da 
                left join Documents d 
                on da.documentId = d.documentId

                join positions p 
              	on p.positionID = ${pos}

              where da.owner = ${pos}
              and d.active = 1
              group by d.documentId, nomenclature, docDepartment, posName 
              
              --documentos donde evalua bonos adicionales #2
              select ab.documentId, 
                    nomenclature, 
                    d.docDepartment, 
                    count(*) cantActivities 
              from aditionalBonos ab, Documents d
              where posEvaluator = ${pos}
              and ab.documentId = d.documentId
              group by ab.documentId, nomenclature, d.docDepartment

              --documentos donde tiene deducciones #3
              select 
                d.documentId,
                description,
                monetaryAmount,
                positionEvaluator,
                nomenclature,
                completed,
                userRegister,
                dateRegister,
                docDepartment,
                userPosition,
                active,
                documentType,
                multiEmployee,
                minimunToAuth
               from documentDeductions de, documents d
              where positionEvaluator = ${pos}
              and d.documentId = de.documentId;

              --datos del puesto del usuario #4
              select * from positions
              where positionID = ${pos};

              --#5 documentos que tiene bonos adicionales 
              select  
                adBonoId,
                d.documentId,
                posEvaluator,
                description,
                monetaryAmount,
                nomenclature,
                evalMonth,
                completed,
                userRegister,
                dateRegister,
                docDepartment,
                userPosition,
                active,
                documentType,
                multiEmployee,
                needSalesCapture,
                needExpensCapture,
                minimunToAuth
              from aditionalBonos ad , documents d
              where ad.posEvaluator = ${pos}
              and d.documentId = ad.documentId;

              --#6 documentos donde tiene autorizaciones finales 
              select 
                d.documentId,
                positionEvaluator,
                [authorization],
                nomenclature,
                evalMonth,
                completed,
                userRegister,
                dateRegister,
                docDepartment,
                userPosition,
                active,
                documentType
              from 
              Documentfinalauth f, 
			        Documents d
              where f.documentId = d.documentId
              and positionEvaluator = ${pos}
              `
              ;
            console.log(sql);

            const response = {};

            database.query(sql, (e)=>{console.log(e);})
              .then((result) => {
                console.log(result.recordsets);
                if (result) {
                  response.status = 'success'
                  response.message = 'Se encontraron documentos para ese puesto'
                  response.simples = result.recordsets[0];
                  response.amounts = result.recordsets[1];
                  response.deductions = result.recordsets[2];
                  response.position = result.recordsets[3][0];
                  response.aditionals = result.recordsets[4];
                  response.finals = result.recordsets[5];

                  res.send(response) 
                }
                else {
                  response.status = 'success'
                  response.message = 'No se pudieron encontrar documentos donde este puesto tenga actividad, valida confuración'
                  res.send(response) 
                }
              })

          }
        }
      })
  }
}

/**
 * envio de documentos para el usuari admin
 * @param {*} req 
 * @param {*} res 
 */
function sendAdminDocuments(req, res)
{
  console.log('usertype "admin"');
  const user = req.usuario;

  const sqlUserData =
      `select * from users where userName = '${user.userId}'`;

    console.log(sqlUserData);

    database.query(sqlUserData)
      .then((result) => {
        if (result != undefined) {

          if (result.rowsAffected[0] > 0) {
            console.log(result.recordset);

            const sql =
              `select
                distinct d.documentId,      
                nomenclature,
                d.docDepartment,
                count(da.activityId) cantActivities
              from
                DocumentActivity da
                left join Documents d       
                on da.documentId = d.documentId
              where d.active = 1
              group by d.documentId, nomenclature, docDepartment
              `
              ;
            console.log(sql);

            database.query(sql, (e)=>{console.log(e);})
              .then((result) => {
                if (result != undefined) {
                  if (result.rowsAffected[0] > 0) { res.send({ status: 'success', message: 'Se encontraron documentos para ese puesto', data: result.recordsets }) }
                  else { res.send({ status: 'error', message: `No se encontraron documentos para el puesto ${pos}` }) }
                }
              }).catch((e)=>{
                console.log('Error en el sql');
              })

          }
        }
      })

}

app.get('/documentByEvaluator', validToken, (req, res) => {
  const userType = req.usuario.type;
  
  switch (userType) {
    case 'evalu':
      sendEvalDocuments(req, res);
    break;

    case 'admin':
      sendAdminDocuments(req,res)
    break; 

    default:
    break;
}
})





EvaluationsQueryController.databaseInstance = database; 
app.get('/evalQuery', validToken, EvaluationsQueryController.main)

/*
app.get('/departments', validToken, (req, res)=>{
  console.log('/departments')
  database.query("select * from departments")
  .then(result=>{
    console.log(result);

    const departments = result.recordset; 
    res.send({status:"success", data:departments })
  })

})
*/


app.get('/docTypes', validToken, (req, res) => {
  console.log("/docTypes");
  const sql = 'select * from documentType where typeId != 1';
  database.query(sql)
    .then((result) => {
      console.log(result);
      if (result.rowsAffected > 0) {
        const data = result.recordset;
        res.send({ status: "success", message: "Se encontraron los tipos de documentos", data: data })
      }

      else {
        res.send({ status: "error", message: "no se encontraron los tipos" })
      }
    })
})

app.get('/positionsByIdList', validToken, (req, res) => {
  console.log('\npositionsList');
  const pList = req.query.positionsList;
  console.log(pList);

  const sql = `SELECT * FROM POSITIONS WHERE POSITIONID IN ( ${pList} )`;

  console.log(sql);

  database.query(sql).then((result) => {
    console.log(result);
    if (result.rowsAffected > 0) {
      res.send({ status: "success", message: "se encontraron los puestos", data: result.recordset })
    }
  }).catch(() => {
    console.log("error");
  })

})


app.get('/positions', validToken, (req, res) => {
  console.log("positions");

  if (req.query.department) {

    const department = req.query.department;
    const sql = `select * from positions p, departments d 
    where d.departName = '${department}'
    and p.departmentId = d.departmentID 
    and p.posName != 'Indefinido'`;

    console.log("\n" + sql);

    database.query(sql)
      .then(result => {
        console.log(result);
        const positions = result.recordset;
        res.send({ status: "success", data: positions })
      });
  }

  else {
    const sql = `select * from positions p, departments d 
    where p.departmentId = d.departmentID 
    and p.posName != 'Indefinido'`;

    console.log("\n" + sql);

    database.query(sql)
      .then(result => {
        console.log(result);
        const positions = result.recordset;
        res.send({ status: "success", data: positions })
      });

  }


})


app.post('/activity', validToken, (req, res) => {
  if (req.usuario.type == "admin") {
    console.log("Mostrando el body");
    console.log(req.body);
    const documentId = req.body.documentId;
    const description = req.body.description; // descripcion de la actividad del doc
    const evaluatedPosition = req.body.evaluatedPosition;
    const applyToPos = req.body.applyToPos;

    //validamos que exista un documento para esa actividad
    const sql = `select * from documents where documentId = ${documentId}`;

    //mes pasado en formado "mm" ejem: 01 
    const previousMonth = (new Date().getMonth() + 1).toString().padStart(2, '0')

    console.log(sql);

    database.query(sql).then(result => {
      console.log(result)

      if (result.rowsAffected > 0) {
        const insert = `DECLARE @InsertedRows TABLE (
                          activityId INT
                        );

                        insert into DocumentActivity 
                        OUTPUT INSERTED.activityId INTO @InsertedRows
                        values ( ${documentId} , '${description}', ${evaluatedPosition}, '${applyToPos}' );

                        SELECT activityID FROM @InsertedRows;
                        `;

        console.log("insertando");
        console.log(insert);


        database.query(insert, (e) => { console.log(e); }).then(inserted => {
          console.log("\n", "el resultado es:\n");
          console.log(inserted);
          if (inserted.rowsAffected[0] > 0) {
            console.log("se ha logrado insertar la actividad", inserted);

            res.send(
              {
                status: "success",
                message: "se ha logrado insertar la actividad",
                activity: { documentId, description }
              })

          }
          else {
            console.log("No se pudo agregar la actividad: ")
            console.log(inserted)
            res.send({ status: "error", message: "No se pudo agregar la actividad" });
          }


        })
          .catch((error) => {
            console.log("No se pudo agregar la actividad");
            console.log(error);
            res.send({ status: "error", message: error })
          })
      }
    })
  }
})

app.delete("/activity", validToken, (req, res) => {
  console.log("DEL ----- activity ------");
  if (req.usuario.type == "admin") {
    let docID = req.body.documentId;
    let actID = req.body.activityId;
    console.log(req.body);
    const delSql = `DELETE DocumentActivity WHERE activityId = ${actID} and documentId = ${docID}`;
    console.log(delSql);

    database.query(delSql).then((result) => {
      console.log("se ha completado el sql");
      console.log(result)
    })
      .catch((error) => {
        console.log("hubo un error al ejecutar el sql");
        console.log(error);
      })
  }
});

app.get('/activities', validToken, (req, res) => {
  console.log("------- acivities ----");
  const docId = req.query.documentId;
  const sql = `select * from documentActivity a, positions p 
              where documentId = ${docId}
              and a.owner = p.positionID
              `;
  console.log(sql);
  database.query(sql).then((result) => {
    //console.log(result);
    if (result.rowsAffected > 0) {
      res.send({ status: "success", message: "datos encontrados", data: result.recordset })
    }

    else {
      res.send({ status: "sucess", message: "no se encontro información" })
    }
  });
});

app.post("/criteria", validToken, (req, res) => {
  console.log("POST ----- criteria");

  if (req.usuario.type == "admin") {
    const actId = req.body.activityId;
    const desc = req.body.description;
    const weigh = req.body.weight;
    const criteriaId = req.body.criteriaId;

    const sql = `INSERT INTO Criterias values ( ${actId}, '${desc}', ${weigh}, ${criteriaId} ) `;

    console.log(req.body);

    console.log(sql);

    database.query(sql).then(
      (result) => {
        console.log("Se ha ejecutado el sql");
        if (result.rowsAffected > 0) {
          res.send({ status: "success", message: "se agrego correctamente" });
        }
        console.log(result);
      },

    ).catch((error) => {
      console.log("Succedio un error");
      console.log(error);
    });
  }
})

app.get('/criterias', validToken, (req, res) => {
  console.log("GET ---------- criterias ----------");
  if (req.usuario.type == "admin") {
    console.log(req.query);
    const activityId = req.query.activityId;
    const sql = `SELECT * FROM Criterias where activityId = ${activityId}`;
    console.log("sql");
    console.log(sql);
    database.query(sql)
      .then((result) => {
        if (result != undefined) {

          console.log("result");
          console.log(result);
          const data = result.recordset;
          res.send({ status: "success", data: data })
        }

        else {
          console.log("error en el result");
          res.send({ status: 'error', message: 'sucedio un error al buscar los criterios' });
        }
      })
  }
})


app.get('/departments', validToken, (req, res) => {
  console.log('/departments', "donde esta el query");
  const sql = `SELECT departmentID, TRIM(departName) departName  FROM departments where departmentID != 5`;
  console.log("la consulta: ", sql);
  database.query(sql)
    .then((result) => {
      if (result.rowsAffected > 0) {
        const data = result.recordset;
        res.send({ status: "success", message: "has solicitado los departamentos", data: data })
      }

      else {
        res.send({ status: "error", message: "no hay departamentos", data: [] })
      }
    })
});

app.get('/positionsByDep', validToken, (req, res) => {
  console.log("positionsByDep");

  const deparment = req.query.departmentId;
  const sql = `SELECT * FROM positions WHERE departmentId = ${deparment}`;
  console.log(sql);
  database.query(sql)
    .then((result) => {
      if (result.rowsAffected > 0) {
        const data = result.recordset;
        res.send({ status: "success", message: "has solicitado los puestos", data: data })
      }

      else {
        res.send({ status: "error", message: "no hay puestos agregados para ese departamento", data: [] })
      }
    })
});



//ruta para las evaluaciones para tabla
EvaluationsForTable.databaseInstance = database; 
app.get('/evaluations', validToken, EvaluationsForTable.main);

app.get('/evalCriterias', validToken, (req, res) => {

  console.log('\n*********************************** /evalCriterias *************************');

  if (req.usuario.type === 'evalu') {
    const sql = `SELECT * FROM Users where userName = '${req.usuario.userId}'`;

    database.query(sql)
      .then((result) => {
        //console.log(result);
        if (result.rowsAffected[0] > 0) {
          //console.log(result.recordset[0].department);
          //console.log(result.recordset[0].position);
          const pos = result.recordset[0].position;
          const activityId = req.query.activityId;
          const numPosEvaluated = req.query.numPosEvaluated;

          if (numPosEvaluated === undefined) {
            res.send({ status: 'error', message: 'Es necesario el número de puesto del evaluado' });
            return;
          }


          /*
          //este no funciona cuando userPosition tiene varios puestos ejem. documento = BP-VTA-18
          const sql2 = `select 
                          a.activityId,
                          a.documentId,
                          a.description actDescription,
                          p.posName evaluador, 
                          p2.posName evaluado,
                          c.description as critDesc,
                          c.criteriaId,
                          weighting,
                          typeId
                        from 
                          documentActivity a, 
                          Documents d, 
                          positions p, 
                          positions p2,
                          criterias c,
                          criteriaTypes ct
                          
                 where owner = ${pos}
                    and a.documentId = d.documentId
                    and active = 1
                    and a.activityId = ${activityId}
                    and p.positionID = owner
                    and d.userPosition = p2.positionID
                    and c.activityId = a.activityId 
                    and c.typeCriteria = ct.typeId;`;
  */


          const sql2 = ` -- primero separamos userPosition (este contiene multiples puestos id) y lo agregamos a un table temporal
                IF OBJECT_ID('tempdb..#temp') IS NOT NULL
                    DROP TABLE #temp;

                CREATE TABLE #temp (
                    activityId INT,
                    documentId INT,
                    actDescription VARCHAR(255),
                    evaluador VARCHAR(255),
                	evaluado VARCHAR(255)
                );
                
                -- Insert into the temporary table based on the SELECT query
                INSERT INTO #temp (activityId, documentId, actDescription, evaluador, evaluado)
                SELECT
                	a.activityId,
                    a.documentId,
                	a.description actDescription,
                	p.posName evaluador,
                	CAST(value AS INT) evaluado
                 FROM
                    DocumentActivity a
                		JOIN
                    Documents d ON d.documentId = a.documentId
                		JOIN
                    positions p ON p.positionId = a.owner
                    CROSS APPLY
                    STRING_SPLIT(ISNULL( d.userPosition, ''), ',') 
                
                where a.owner = ${pos}
                and a.activityId = ${activityId}
                and CAST(value AS INT) = ${numPosEvaluated} --puesto del evaluado
                                
                select	
                	t.activityId,
                    t.documentId,
                    t.actDescription,
                    t.evaluador,
                    p.posName evaluado,
                    c.description as critDesc,
                    c.criteriaId,
                    weighting,
                    typeId     
                from 
                	criterias c, 
                	#temp t,
                	positions p,
                	criteriaTypes ct
                where c.activityId = t.activityId
                and c.activityId = t.activityId
                and c.typeCriteria = ct.typeId
                and p.positionID = t.evaluado;  `;

          console.log(sql2);

          database.query(sql2)
            .then((result) => {
              console.log(result);
              console.log("El resultado es");
              console.log(result.rowsAffected.length);

              if (result.recordset.length > 0) {
                //console.log("se encontraron actividades para ese puesto");
                //console.log(result.recordset);
                const criterias = result.recordset;
                const evalId = req.query.evalid;
                console.log(evalId)
                res.send({ status: "success", message: "Criterios encontrados", data: criterias, evalId: evalId });
              }

              else {
                console.log("No se encontraron criterios");
                res.send({ status: "error", message: "no se encontraron los criterios" });
              }
            })
            .catch((error) => {
              console.log("Sucedio un error al ejecutar la consulta", error);
            })
        }
      })
      .catch((error) => {
        console.log("Error al buscar el usuario:", req.usuario.userId
        );
        console.log(error);
      })

  }
});

app.get('/criteriaTypes', validToken, (req, res) => {
  const sql = 'SELECT * FROM criteriaTypes';
  database.query(sql)
    .then((result) => {
      if (result.rowsAffected) {
        const data = result.recordset;
        res.send({ status: "success", message: "se encontrarons los tipos de criterios", data: data })
      }
    })
})


app.get('/stores', validToken, (req, res) => {
  console.log('----------   stores  -----------');
  const sql = "SELECT * FROM stores";

  database.query(sql).
    then((result) => {
      console.log(result)
      if (result.rowsAffected > 0) {
        res.send({ status: "success", data: result.recordset });
      }

      else {
        res.send({ status: "error", message: "no se encontro la información de las tiendas" });
      }
    }).catch(() => {
      console.log("Error al ejecutar el query")
    });
})

app.post('/addBono', validToken, (req, res) => {
  console.log('-------------------------- addBono -------------------------');
  console.log(req.body)
  try {


    const date = new Date(); // Replace this with your date
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;

    const evalId = req.body.evalId;
    const criType = req.body.typeId;
    const criId = req.body.criteriaId;
    const result = req.body.average;



    //criteriaEvalId	evalId	criteriaType	criteriaId	resultValue
    const sql = `INSERT INTO criteriasEvaluation VALUES ( ${evalId}, ${criType} , ${criId}, '${result}');
              UPDATE evaluations SET finishDate = '${today}' WHERE  evalId = ${evalId}`;
    console.log(sql);

    database.query(sql)
      .then((result) => {
        console.log(result);
        if (result.rowsAffected[0] > 0 && result.rowsAffected[1] > 0) {
          res.send({ status: "success", message: "se ha agregado la información" });
          console.log('Se actualizó correctamente');
        }
      })

  } catch (error) {
    console.log("sucedio un error");
  }

});

app.get('/criteriasCompleted', validToken, (req, res) => {
  console.log('-------------------------------- /criteriasCompleted ------------------------------');
  const evalid = req.query.evalId;

  console.log(req.query);

  const sql = `select 
                  ce.evalId, 
                  c.description, 
                  c.typeCriteria,
                  monthToEvaluate, 
                  ce.resultValue,
                  finishDate, 
                  weighting, 
                  p2.posName evaluado, 
                  p1.posName evaluador  
                from criteriasEvaluation ce, 
                  evaluations e, 
                  criterias c, 
                  positions p1, 
                  positions p2
                where ce.evalId = e.evalId
                and c.criteriaId = ce.criteriaId
                and ce.evalId = ${evalid}
                and p2.positionID = e.posEvaluated
                and p1.positionID = e.posEvaluator`;

  console.log(sql);

  database.query(sql, (error) => {
    console.log('Error en la consulta', error);
  }).
    then((result) => {
      console.log('Result: ', result);
      if (result.rowsAffected > 0) {
        res.send({ status: "success", message: "se encontraron las calificaiones", data: result.recordset });
      }

      else {
        res.send({ status: "error", message: `No existen calificaciones para el evalID ${evalid}` });

      }
    })

});

app.post('/updateCriteria', validToken, (req, res) => {
  console.log('********* updateCriteria **********');
  console.log(req.body)
  const oldData = req.body.oldData;
  const newData = req.body.newData;
  const sql = `UPDATE Criterias SET description = '${newData.description}', weighting = ${newData.weighting} WHERE CriteriaId = ${oldData.criteriaId} `;
  console.log(sql);
  database.query(sql).then((result) => {
    console.log(result);
    if (result.rowsAffected > 0) {
      res.send({ status: 'success', message: 'se ha actualizado el criterio' })
    }

    else {
      res.send({ status: 'error', message: 'sucedio un error al actualizar el criterio' })
    }

  }).catch((error) => {
    console.log("sucedio un error al ejecutar el sql");
  })
})

app.delete('/delCriteria', validToken, (req, res) => {
  console.log("eliminando el criterio");
  const criteriaData = JSON.parse(req.query.criteriaData);
  console.log(criteriaData);

  const sql = `DELETE CRITERIAS WHERE CRITERIAID = ${criteriaData.criteriaId} AND ACTIVITYID = ${criteriaData.activityId}`;
  console.log(sql)

  database.query(sql)
    .then((result) => {

      if (result.rowsAffected > 0) {
        res.send({ status: 'success', message: 'Se ha eliminado el criterio' });
      }

      else {
        res.send({ status: 'error', message: 'No se ha podido eliminar el criterio' })
      }
    })
    .catch((error) => {
      console.log('no se pudo ejecutar el sql');
    })
})

app.delete('/delDocument', validToken, (req, res) => {
  console.log('************* /delDocument **************');
  //console.log(req.body);
  const sql = `UPDATE DOCUMENTS SET ACTIVE = 0 WHERE DOCUMENTID = '${req.body.documentId}' AND USERREGISTER = '${req.body.userRegister.trim()}'`;
  console.log(sql);
  database.query(sql)
    .then((result) => {
      if (result.rowsAffected > 0) {
        res.send({ status: 'success', message: 'se ha eliminado el documento' });
      }

      else {
        res.send({ status: 'error', message: 'no se pudo eliminar el documento solicitado' });
      }
    })
    .catch(() => { console.log("no se pudo ejecutar la consulta"); })
})


app.post('/condition', validToken, (req, res) => {
  console.log("*********************** /condition **************");
  console.log(req.body);

  const docId = req.body.documentData.documentId;
  const descrip = req.body.description;

  const sql = `DECLARE @insertedRows table ( conditionId int ); 

               INSERT INTO ACTIVITYCONDITIONS 
               OUTPUT INSERTED.conditionId INTO @insertedRows
               VALUES ( '${descrip}',  ${docId}) 
               
               SELECT * FROM @insertedRows`
    ;

  console.log(sql);

  database.query(sql)


    .then((result) => {

      console.log("result");
      console.log(result);

      if (result.rowsAffected[1] > 0) {
        res.send({ status: 'success', message: `se ha agregado la condición para el documento ${docId}`, data: result.recordset[0] });
      }

      else {
        res.send({ status: 'error', message: 'No se pudo agregar la condición' });
        console.log("no se pudo agregar la condicion ");
      }
    })

    .catch((error) => {
      console.log("No se pudo ejecutar el sql");
    })
})

app.get('/condition', validToken, (req, res) => {
  console.log('GET ************** condition ************');
  const documentData = JSON.parse(req.query.documentData);
  const docId = documentData.documentId;
  console.log(req.query);
  const sql = `SELECT * FROM activityConditions WHERE documentId = ${docId}`;
  console.log(sql);

  database.query(sql).
    then((result) => {
      if (result.rowsAffected > 0) {
        res.send({ status: 'success', message: `Se encontro una condición para el documento ${docId}`, data: result.recordset })
      }

      else {
        res.send({ status: 'error', message: 'no se encontraron condiciones para ese documento' });
      }

    }).catch((error) => { console.log("Error al ejecutar el query ", error); })
})

app.post('/conditionCriteria', validToken, (req, res) => {
  console.log('*********************** conditionCriterias *****************');
  const criterio = req.body.criterio;
  const conditionId = req.body.conditionId;
  const value = req.body.value;

  console.log(req.body);

  const sql = `insert into conditionCriterias values ( ${conditionId}, '${criterio}', '${value}')`;

  database.query(sql)
    .then((result) => {
      if (result.rowsAffected > 0) {
        res.send({ status: 'success', message: 'se agrego correctamente el criterio' });
      }

      else {
        res.send({ status: 'error', message: 'no se pudo agregar el criterio' })
      }

    })
    .catch((error) => {
      console.log("sucedio un error al ejecutar el sql", error);
    })

});

app.get('/conditionCriteria', validToken, (req, res) => {

  console.log("****************************** GET conditionCriteria *********************");

  const conditionId = req.query.conditionId;
  const sql = `SELECT * FROM conditionCriterias WHERE conditionId = ${conditionId}`;

  console.log(sql);

  database.query(sql)
    .then((result) => {
      if (result.rowsAffected > 0) {
        res.send({ status: 'success', message: "se encontraros criterios", data: result.recordset });
      }

      else {
        res.send({ status: 'error', message: 'no se encontraron criterios' })
      }
    }).catch((error) => {
      console.log('sucedio un error al ejecutar el sql');
    })
})

app.post('/aditionalBono', validToken, (req, res) => {
  console.log("********************** POST aditionalBono ******************");
  console.log(req.body);
  const documentData = req.body.documentData;
  const documentId = documentData.documentId;
  const description = req.body.description;
  const value = req.body.amount;
  const posEvaluator = req.body.posEvaluator;
  const type = req.body.type;
  const percentage = req.body.percentage;

  let sql = '';

  switch (type) {
    case 'Ventas':
      console.log('insertando en documentSales');

      sql = `DECLARE @InsertedRows table ( salesId int  );  
              INSERT INTO documentSales ( description, documentId, percentage, posEvaluator )  OUTPUT 
              INSERTED.salesId
              INTO @InsertedRows VALUES ( '${description}', ${documentId}, ${percentage}, ${posEvaluator} );
              SELECT * FROM @InsertedRows; 
            ` ;

      console.log(sql);
      break;

    case 'Gastos':
      sql = `DECLARE @InsertedRows table ( expensId int  );  
        INSERT INTO expenses ( description, documentId, percentage, posEvaluator )  OUTPUT 
        INSERTED.expensId
        INTO @InsertedRows VALUES ( '${description}', ${documentId}, ${percentage} , ${posEvaluator} );
        SELECT * FROM @InsertedRows; 
      ` ;
      console.log('insertando en document expenses');
      break;

    case 'Criterio':
      sql = `DECLARE @InsertedRows table ( adbonoId int  );  
                INSERT INTO aditionalbonos ( documentId, posEvaluator, description,   monetaryAmount )  OUTPUT 
                INSERTED.adbonoId
                INTO @InsertedRows VALUES (  ${documentId}, '${posEvaluator}', '${description}',  0 );
                SELECT * FROM @InsertedRows; 
              ` ;

      console.log('insertando en document aditionalBono');
      break;
  }

  console.log(sql);

  database.query(sql, (e) => { console.log('Error en el sql', e); }).
    then((result) => {
      if (result != undefined) {
        if (result.rowsAffected[1] > 0) {
          res.send({ status: 'success', message: 'Se agrego correctamente el bono adicional', data: { idRegistro: result.recordset } });
        }

        else {
          res.send({ status: 'error', message: 'no se pudo insertar el bono adicional' })
        }
      }
    }).catch((error) => {
      console.log("Error al ejecutar el sql", error);
    })
})

app.get('/aditionalBono', validToken, (req, res) => {
  console.log("************************ GET aditonalBono *****************");
  const documentData = JSON.parse(req.query.documentData);
  const documentId = documentData.documentId;
  console.log(req.query);
  const sql = `SELECT * FROM aditionalBonos WHERE documentId = ${documentId}`;

  console.log(sql);

  database.query(sql)
    .then((result) => {
      if (result.rowsAffected > 0) {
        res.send({ status: 'success', message: 'se encontraron los bonos adicionales', data: result.recordset })
      }
      else { res.send({ status: 'error', message: 'no se encontraron bonos adicionales' }) }
    })
})

app.get('/deduction', validToken, (req, res) => {
  console.log('GET ********************** deduction ****************');
  console.log(req.query);
  const documentData = JSON.parse(req.query.documentData);
  const documentId = documentData.documentId;
  const sql = `SELECT * FROM DOCUMENTDEDUCTIONS WHERE DOCUMENTID = ${documentId}`;
  console.log(sql);

  database.query(sql).then((result) => {
    if (result.rowsAffected > 0) {
      res.send({ status: 'success', message: 'se encontraron deducciones para el document', data: result.recordset })
    }

    else {
      res.send({ status: 'error', message: 'no se encontraron deducciones para ese documento' });
    }
  }).catch((error) => {
    console.log('no se pudo ejecutar el sql ');
    console.log(error);
  })


});

app.post('/deduction', validToken, (req, res) => {
  console.log('POST ********************** deduction ****************');
  console.log(req.body);
  const documentData = req.body.documentData;
  const documentId = documentData.documentId;
  const description = req.body.description;
  const amount = req.body.amount;

  const sql = `INSERT INTO DOCUMENTDEDUCTIONS VALUES ( ${documentId}, '${description}', ${amount} )`;
  console.log(sql);

  database.query(sql, (sqlError) => { sqlError }).
    then((result) => {
      console.log(result);
      if (result.rowsAffected[0] > 0) {
        console.log('success');
        res.send({ status: 'success', message: 'Se agrego correctamente la deducción' })
      }

      else {
        console.log('error');
        res.send({ status: 'error', message: 'no se pudo agregar la deducción' });
      }
    }).catch((error) => {
      console.log('error al ejecutar la consulta');
    })
})

app.get('/employees', validToken, (req, res) => {
  console.log("********************* employees *****************");
  const sql = `select e.*, p.posName from employees e, positions p 
              where e.position = p.positionID `;
  database.query(sql).then((result) => {
    if (result.rowsAffected > 0) {
      res.send({ status: 'success', message: 'se encontraron empleados', data: result.recordset })
    }
    else {
      res.send({ status: 'error', message: 'no se encontraron empleados' })
    }
  })
})

app.post('/employees', validToken, (req, res) => {
  const num = req.body.empNum;
  const name = req.body.empName;
  const pos = req.body.empPosition;

  const sql = `insert into employees values ( ${num}, '${name}', ${pos} ); `;

  console.log(sql);

  database.query(sql).then((result) => {
    if (result.rowsAffected > 0) {
      res.send({ status: 'success', message: `Se agrego al empleado: ${num}` })
    }
    else {
      res.send({ status: 'error', message: 'No se pudo agregar el empleado' })
    }
  }).catch((e) => {
    console.log("error al ejecutar el sql", e);
  })
})


app.get('/schedule', validToken, (req, res) => {
  for (let i = 0; i < scheduledTaskManager.tasks.length; i++) {
    if (scheduledTaskManager.tasks[i].task.constructor.name == 'GenerateEvaluations') {
      res.send({ status: 'success', schedule: scheduledTaskManager.tasks[i].schedule });
      return;
    }
  }

  res.send({ status: 'error', message: 'no se pudo obtener el ' })
})


//el sql para generar las evaluaciones de los documentos en los que se evaluan 2 empleados o más 



//ruta para generar las evaluaciones del mes anterior
app.get('/createEvaluations', validToken, (req, res) => {
  console.log('\n--------------------------- createEvaluations -----------------------------');

  if (req.usuario.type != "admin") {
    res.send({ status: "error", message: "no cuentas con los prilegios" });
    return;
  }

  console.log('generando manualmente las evaluaciones');

  const typeDoc = ['d.multiEmployee', 'd.userPosition'];

  let response = [];

  typeDoc.forEach((type) => {

    console.log('Generando la consulta del tipo: ', type);

    const sqlTemplate =
      `IF OBJECT_ID('tempdb..#TempSplitRows') IS NOT NULL
      DROP TABLE #TempSplitRows;
  
      CREATE TABLE #TempSplitRows (
        activityId INT,
        description VARCHAR(MAX),
        monthToEvaluate date ,
      posEvaluated INT,
      posEvaluator INT,
      finishdate DATE
      );
      
    -- se crean las pre evaluaciones
   INSERT INTO #TempSplitRows ( monthToEvaluate, posEvaluated, posEvaluator, activityId, finishdate)
    
    /* 
    datos inportantes para crear la evaluacion: 
        * Documentos 
    * Actividades 
    * Puestos 
    */
   
   SELECT
   (  SELECT DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()) - 1, 0) AS PreviousMonth) monthToEvaluated, 
  
   CAST(value AS INT) AS evaluated,
   a.owner AS evaluator,
   a.activityId,
   NULL AS finishdate
   
   FROM
      DocumentActivity a
      JOIN
      Documents d ON d.documentId = a.documentId
        JOIN
      positions p ON p.positionId = a.owner
      CROSS APPLY
      STRING_SPLIT(ISNULL( d.userPosition, ''), ',') 
      
      insert into evaluations  ( monthToEvaluate,posEvaluated,posEvaluator,employeeId,activityId,finishDate ) 
      select 	
      monthToEvaluate,	
      posEvaluated,	
      posEvaluator, 
      e.employeeID,	
      activityId,	
      finishDate
      from #TempSplitRows t
      JOIN
      employees e ON t.posEvaluated = e.position
      
      -- solo si no existen ya 
      AND NOT EXISTS (
        SELECT 1
        FROM evaluations e2
     WHERE
         e2.monthToEvaluate = t.monthToEvaluate
         AND e2.posEvaluated = t.posEvaluated
         AND e2.posEvaluator = t.posEvaluator
         AND e2.employeeId = e.employeeId
         AND e2.activityId = t.activityId );
         
    
      --se crean los registros para agregar en la evaluacion de las cantidades de ventas y presupuestos 
      -- usado para calcular los porcentajes del bono
      insert into evaluationSales
      select 
        distinct da.documentId, 
        em.employeeID, 
        e.monthToEvaluate,
        0, --month goal 
        0, --accumulated goal 
        0, -- monthachieve
        0, --accumulated achieve
        '', --auth
        '', --authdate 
        '', --userauth
        ''  --condition
      from evaluations e, 
        DocumentActivity da, 
        employees em, 
        documentSales ds
      where e.activityId = da.activityId
      and e.employeeId = em.employeeID
      and ds.documentId = da.documentId
      and not exists (
        select 1  from evaluationSales es2
        where es2.documentId = da.documentId
        and es2.employeeId = em.employeeID
        and es2.monthEvaluated = e.monthToEvaluate
        ) ;
           
        insert into evaluationExpenses
        select 
          documentId, 
          em.employeeID, 
          DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()) - 1, 0) monthToEvaluate,
          0,
          0,
          0,
          0,
          '' 
        from  documents d cross apply STRING_SPLIT(ISNULL( d.userPosition, ''), ',') 
        join employees em on em.position = value
        where needExpensCapture = 1
        and not exists ( select 1 from evaluationExpenses ee 
               where  d.documentId = ee.documentId 
               and  em.employeeID = ee.employeeId 
               and  DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()) - 1, 0) = ee.monthEvaluated)
      
        insert into evalAditionalBono 
        select distinct ad.adBonoId, '','', null, e.employeeId, e.monthToEvaluate, 0, '' from evaluations e, aditionalBonos ad,  DocumentActivity da, documents d
        where e.activityId = da.activityId
        and da.documentId = d.documentId
        and ad.documentId = d.documentId
        and not exists (
        select 1 from evalAditionalBono eab
        where eab.evalDate = e.monthToEvaluate
        and eab.employeeId = e.employeeId
        and eab.adId = ad.adBonoId
        );

        -- el siguiente parece repetido pero genera las evaluaciones para cuando se evaluan varios empleados en un mismo documento
        SELECT
   (  SELECT DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()) - 1, 0) AS PreviousMonth) monthToEvaluated, 
  
   CAST(value AS INT) AS evaluated,
   a.owner AS evaluator,
   a.activityId,
   NULL AS finishdate
   
   FROM
      DocumentActivity a
      JOIN
      Documents d ON d.documentId = a.documentId
        JOIN
      positions p ON p.positionId = a.owner
      CROSS APPLY
      STRING_SPLIT(ISNULL( d.multiEmployee, ''), ',') 
      
      insert into evaluations  ( monthToEvaluate,posEvaluated,posEvaluator,employeeId,activityId,finishDate ) 
      select 	
      monthToEvaluate,	
      posEvaluated,	
      posEvaluator, 
      e.employeeID,	
      activityId,	
      finishDate
      from #TempSplitRows t
      JOIN
      employees e ON t.posEvaluated = e.position
      
      -- solo si no existen ya 
      AND NOT EXISTS (
        SELECT 1
        FROM evaluations e2
     WHERE
         e2.monthToEvaluate = t.monthToEvaluate
         AND e2.posEvaluated = t.posEvaluated
         AND e2.posEvaluator = t.posEvaluator
         AND e2.employeeId = e.employeeId
         AND e2.activityId = t.activityId );
         
         insert into evalAditionalBono 
         select distinct ad.adBonoId, '','', null, e.employeeId, e.monthToEvaluate, 0, '' from evaluations e, aditionalBonos ad,  DocumentActivity da, documents d
         where e.activityId = da.activityId
         and da.documentId = d.documentId
         and ad.documentId = d.documentId
         and not exists (
         select 1 from evalAditionalBono eab
         where eab.evalDate = e.monthToEvaluate
         and eab.employeeId = e.employeeId
         and eab.adId = ad.adBonoId
         );

         `;

    console.log(sqlTemplate);

    database.query(sqlTemplate, (e) => { console.log('Error en el sql:', e); })
      .then((result) => {
        console.log('el then');
        console.log(result);
        response.push(
          {
            status: 'success',
            type: type,
            preEvaluations: result.rowsAffected[0],
            generated: result.rowsAffected[1]
          })

        //si ya terminaron las 2 inserciones
        if (response.length > 1) {
          console.log('dos consultas ');
          res.send(response);
        }

      }).catch((e) => {
        //res.send({status:'error',message: 'no se pudo ejecutar la cosulta'})
        console.log('error');
        console.log(e);
      })

  })


})

app.post('/saveEval', validToken, (req, res) => {
  console.log('***************************** /saveEval *****************************');
  const marks = req.body.calificaciones;
  let sql = "";


for (let prop in marks){
  
  console.log('Leyedo la propiedad: ', prop, 'del Objeto:', marks);
  
  const evalId = marks[prop][prop].EvalId;
  const cId =  marks[prop][prop].Criterio;
  const typeCriteria = marks[prop][prop].CriteriaType;

    sql += `\ninsert into criteriasEvaluation ( evalId, criteriaType, criteriaId, resultValue ) values ( ${evalId}, ${typeCriteria}, ${cId}, '' );\n`;

    const date = new Date(); // Replace this with your date
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;

    sql += `\n update evaluations set finishdate = '${today}' where evalId = ${evalId}; \n`;

  }

    console.log(sql);

  
    //INSERCION DE LAS CALIFICACIONES
    database.rollbackQuery(sql).
      then((result) => {
        if (result != undefined) {
          if (result.rowsAffected[0] > 0) {
            res.send({ status: 'success', message: 'se actualizo la evaluación' })
            console.log('\n Se ejecuto correctamente', sql);
          }
          else {
            res.send({ status: 'error', message: 'No se pudo guardar la evaluación' });
          }
        }
      }).catch((error) => {
        console.log('Sucedio un error al ejecutar el query');
      })
})

app.post('/salesBono', validToken, (req, res) => {
  console.log('******************************************** /salesBono *****************************');

  const docData = req.body.documentData;
  const percent = req.body.percent;
  console.log(docData);

  const documentId = docData.documentId;

  const sql = `update documents set needSalesCapture = 1 
               where documentId =  ${documentId}`;

  console.log(sql);

  database.query(sql)
    .then((result) => {
      if (result != undefined) {
        if (result.rowsAffected[0] > 0) {
          res.send({ status: 'success', message: 'Este docuento solicitará la captura de ventas' });
        }
        else {
          res.send({ status: 'error', message: 'Error al actualizar el documento' });

        }
      }
    })
})

app.post('/budgetBono', validToken, (req, res) => {
  console.log('******************************************** /budgetBono *****************************');

  const docData = req.body.documentData;
  const percent = req.body.percent;

  console.log(docData);

  const documentId = docData.documentId;

  const sql = `update documents set needExpensCapture = 1 
                where documentId =  ${documentId}
                
                select * from expenses
                where documentId =  ${documentId}

                `;

  console.log(sql);

  database.query(sql, (e)=>{console.log(e);})
    .then((result) => {
      if (result != undefined) {
        if (result.rowsAffected[0] > 0) {
          res.send({ status: 'success', message: 'Se agregó el bono por presupuesto' });
        }
        else {
          res.send({ status: 'error', message: 'No se púdo agregar el bono por presupuesto' });

        }
      }
    })
})


app.post('/saveSales', validToken, (req, res) => {
  console.log('************************************************ /saveSales************************************');

  const documentId = req.body.documentId;
  const employeeId = req.body.employeeId;
  const monthEvaluated = req.body.monthEvaluated;
  const monthSales = req.body.monthSales;
  const cumulatedSales = req.body.cumulatedSales;
  const cumulatedSalesGoal = req.body.cumulatedSalesGoal;
  const salesGoal = req.body.salesGoal;

  const dateEvaluated = new Date(monthEvaluated);
  const month = dateEvaluated.getUTCMonth() + 1;
  const year = new Date().getUTCFullYear();

  const sqls = `update evaluationSales set monthGoal = ${salesGoal}, accumulatedGoal = ${cumulatedSalesGoal}, monthAchieve = ${monthSales}, accumulatedAchieve = ${cumulatedSales} where documentId = ${documentId} and employeeId = ${employeeId} and month(monthEvaluated) = ${month} and year(monthEvaluated) = ${year} `;

console.log(sqls);

  database.query(sqls, (e) => { console.log('error: ', e); }).
    then((result) => {
      if (result != undefined) {
        console.log(result);
        if (result.rowsAffected[0] > 0) {
          res.send({ status: 'success', message: 'Se actualizó la evaluación' });
        }
        else {

          res.send({ status: 'error', message: 'No se encontró el registro para actualizar' });
        }
      }
      else {
        console.log('Error con el sql');
      }
    }).catch((e) => { console.log("error: ", error); })



})

app.post('/saveExpenses', validToken, (req, res) => {
  console.log('************************************************ /saveExpenses************************************');

  const body = req.body; 
  const documentId = body.documentId;
  const employeeId = body.employeeId;
  const monthEvaluated = body.monthEvaluated;
  const monthExpend = body.monthExpend;
  const cumulatedExpend = body.cumulatedExpend;
  const expendGoal = body.expendGoal;
  const cumulatedExpendGoal = body.cumulatedExpendGoal;

  const dateEvaluated = new Date(monthEvaluated);
  const month = dateEvaluated.getUTCMonth() + 1;
  const year = new Date().getUTCFullYear(); // obteniendo el año actual 

  const sqls = `update evaluationExpenses 
                  set monthGoal = ${expendGoal}, 
                    accumulatedGoal = ${cumulatedExpendGoal}, 
                    monthAchieve = ${monthExpend}, 
                    accumulatedAchieve = ${cumulatedExpend} 
                  where documentId = ${documentId} 
                  and employeeId = ${employeeId} 
                  and month(monthEvaluated) = ${month} 
                  and year(monthEvaluated) = ${year} `;

  console.log(sqls);

  database.query(sqls, (e) => { console.log('error: ', e); }).
    then((result) => {
      if (result != undefined) {
        console.log(result);
        if (result.rowsAffected[0] > 0) {
          res.send({ status: 'success', message: 'Se actualizó la evaluación' });
        }
        else {

          res.send({ status: 'error', message: 'No se encontró el registro para actualizar' });
        }
      }
      else {
        console.log('Error con el sql');
      }
    }).catch((e) => { console.log("error: ", error); })



})


app.post('/saveAditionalBonos', validToken, (req, res) => {

  console.log("******************************************************** saveAditionalBonos ************************************");

  const auth = req.body.auth;
  const documentId = req.body.documentId;
  const employeeId = req.body.employeeId;
  const user = req.usuario.userId

  const sql = `update evaluationSales set authorized = '${auth}', authDate = getDate(), userAuth = '${user}'
                where documentId = ${documentId} 
                and employeeId = ${employeeId}
                `;

  console.log(sql);

  database.query(sql, (error) => { console.log(error) }).then((result) => {
    if (result != undefined) {
      if (result.rowsAffected[0] > 0) {
        res.send({ status: 'success', message: 'Se agrego la autorización' });
      }
      else {
        res.send({ status: 'error', message: 'No se encontro el registro' });
      }
    }
  }).catch((error) => {
    console.log('Hubo un error al ejecutar el sql', error);
  })



})


app.post('/adBonoCriteria', validToken, (req, res) => {
  const body = req.body;
  const bonoData = body.adBonodata;
  const auth = body.auth;
  const user = req.usuario.userId;
  const adId = bonoData[0].adBonoId;
  const employeeId = bonoData[0].employeeID;
  const month = body.month;

  let sql = "";

  for (let i = 0; i < auth.length; i++) {
    if (auth[i]) {
      sql += `update evalAditionalBono 
                set auth = '${auth[i]}', 
                userAuth = '${user}', 
                dateAuth = getDate() 
                where adId = ${i}
                and employeeId = ${employeeId}
                and month(evalDate) = ${month} ;\n`;
    }
  }


  database.query(sql).then((result) => {
    console.log(result);
    if (result != undefined) {
      if (result.rowsAffected[0] > 0) {
        res.send({ status: 'success', message: 'Se guardo correctamente el registro' });
      }
      else {
        res.send({ status: 'error', message: 'No se encontró el registro para actualizar' });
      }
    }
  })

  console.log(sql);

})

app.post('/addBonoAuth', validToken, (req, res)=>{
  console.log('***************************************************** /addBonoAuth ***************************');

  const documentId = req.body.documentId; 
  const employeeId = req.body.employeeId; 
  const monthEvaluated = req.body.monthEvaluated; 
  const average = req.body.average; 
  const authorized = req.body.authorized; 
  const amounth = req.body.amounth; 
  const userAuth = req.usuario.userId; 
  const sql = 
  `
  insert into DocumentBonoAuth
    values ( ${documentId}, 
             ${employeeId}, 
             '${monthEvaluated}', 
             ${average}, 
             '${authorized}', 
             ${amounth}, 
             '${userAuth}', 
             getDate() );

  `;

  console.log(sql);

  database.query(sql,(e)=>{
    console.log(e);
    if (e.number == 2627){
      res.send({status:'error', message:'Ya se ha autorizado este bono'})
    }
  }).then((r)=>{
    if (r)
    {
      if(r.rowsAffected[0]>0)
      {
        res.send({status:'success', message:'Se agrego la autorización del bono'});
      }
      else 
      {
        res.send({status:'error', message:'No se pudo agregar la autorización del bono'})
      }
    }
  })
  								
})

app.post('/docAverage', validToken,  (req, res)=>{
  console.log('*************************************** /docAverage ******************************');
  const docData = req.body.doc; 
  const docId = docData.documentId; 
  const newAverage = req.body.newDocAverage;
  console.log(docId);

  const sql = `update documents set minimunToAuth = ${newAverage} where documentId = ${docId}`;

  console.log(sql);

  database.query(sql).then((r)=>{
    if (r != undefined)
    {
      res.send({status:'success', message:'Se actualizo correctamente'})
    }
    else {
      res.send({status:'error', message:'No se pudo actualizar el documento'})
    }
  })

})

app.get('/PromProdStores', validToken, (req, res) => {

  console.log('****************************************** /PromProdStores *************************');
  const month = req.query.date;
  //console.log(req.query);
  //Puestos de gerentes de tienda 
  const GerentesTienda = [
    21,	//Gerente Federalismo                                         
  1024,	//Gerente León                                                
  1026,	//Gerente Urban                                               
  1027,	//Gerente Puebla                                              
  1028,	//Gerente Querétaro                                           
  1029,	//Gerente López Mateos                                        
  1030,	//Gerente Irapuato                                            
  1031	//Gerente Patria                                              
  ];

  let sql = ''; 

  GerentesTienda.forEach((t)=>{
    sql += `
    select * from DocumentBonoAuth dba, employees em
      where documentId = 13 --bono productividad para gerentes de tienda
      and month(monthEvaluated) = ${month}
      and em.employeeID = dba.employeeId
      and em.position = ${t} ; \n`;
  })

  //console.log(sql);

  const response = { 
    status:'', 
    message:'', 
    ProductivityAverages: {
      Federalismo:[],
      Leon:[] ,
      Urban:[],
      Puebla:[],
      Queretaro:[],
      Lopez:[],
      Irapuato:[],
      Patria:[]
    } };

  database.query(sql, (e)=>{console.log("error en sql", e);}).then((r)=>{
    if (r != undefined){
      response.status = 'success';
      response.message = 'Se encontraron los promedios de productividad';
      response.ProductivityAverages.Federalismo = r.recordsets[0][0] || {average:0}; //primer query ,primer registro
      response.ProductivityAverages.Leon        = r.recordsets[1][0] || {average:0}; // si es indefinido pone un objeto con promedio en 0
      response.ProductivityAverages.Urban       = r.recordsets[2][0] || {average:0}; 
      response.ProductivityAverages.Puebla      = r.recordsets[3][0] || {average:0}; 
      response.ProductivityAverages.Queretaro   = r.recordsets[4][0] || {average:0}; 
      response.ProductivityAverages.Lopez       = r.recordsets[5][0] || {average:0}; 
      response.ProductivityAverages.Irapuato    = r.recordsets[6][0] || {average:0}; 
      response.ProductivityAverages.Patria      = r.recordsets[7][0] || {average:0}; 

      //console.log(response);
      res.send(response)
    } 
  })


})

app.get('/PromExpensStores', validToken, (req, res) => {

  console.log('****************************************** /PromExpensStores *************************');
  const month = req.query.date;
  //Puestos de gerentes de tienda 
  const GerentesTienda = [
    21,	//Gerente Federalismo                                         
  1024,	//Gerente León                                                
  1026,	//Gerente Urban                                               
  1027,	//Gerente Puebla                                              
  1028,	//Gerente Querétaro                                           
  1029,	//Gerente López Mateos                                        
  1030,	//Gerente Irapuato                                            
  1031	//Gerente Patria                                              
  ];

  let sql = ''; 

  GerentesTienda.forEach((t)=>{
    sql += `
    select * from DocumentBonoAuth dba, employees em
      where documentId = 1014 --bono control de inventarios para gerentes de tienda
      and month(monthEvaluated) = ${month}
      and em.employeeID = dba.employeeId
      and em.position = ${t} ; \n`;
  })

  const response = { 
    status:'', 
    message:'', 
    ExpensesAverages: {
      Federalismo:[],
      Leon:[] ,
      Urban:[],
      Puebla:[],
      Queretaro:[],
      Lopez:[],
      Irapuato:[],
      Patria:[]
    } };

  database.query(sql, (e)=>{console.log("error en sql", e);}).then((r)=>{
    if (r != undefined){
      response.status = 'success';
      response.message = 'Se encontraron los promedios de gastos';
      response.ExpensesAverages.Federalismo = r.recordsets[0][0] || {average:0}; //primer query ,primer registro
      response.ExpensesAverages.Leon        = r.recordsets[1][0] || {average:0}; // si es indefinido pone un objeto con promedio en 0
      response.ExpensesAverages.Urban       = r.recordsets[2][0] || {average:0}; 
      response.ExpensesAverages.Puebla      = r.recordsets[3][0] || {average:0}; 
      response.ExpensesAverages.Queretaro   = r.recordsets[4][0] || {average:0}; 
      response.ExpensesAverages.Lopez       = r.recordsets[5][0] || {average:0}; 
      response.ExpensesAverages.Irapuato    = r.recordsets[6][0] || {average:0}; 
      response.ExpensesAverages.Patria      = r.recordsets[7][0] || {average:0}; 

      //console.log(response);
      res.send(response)
    } 
  })

})

app.get('/globalSales', validToken, (req,res)=>{

  const month = req.query.month;
  const sql = `
  select SUM(monthAchieve)       monthTotalSales , 
         SUM(monthGoal)          monthGoalSales, 
         SUM(accumulatedAchieve) totalCumullated, 
         SUM(accumulatedGoal)    totalCumulatedGoal
  from evaluationSales e, positions p, employees em
    where month(e.monthEvaluated) = ${month}
    and year(e.monthEvaluated)= year(getDate())
    and e.employeeId = em.employeeID
    and em.position = p.positionID
    and em.position in ( 
      21,	--Gerente Federalismo                                         
      1024,	--Gerente León                                                
      1026,	--Gerente Urban                                               
      1027,	--Gerente Puebla                                              
      1028,	--Gerente Querétaro                                           
      1029,	--Gerente López Mateos                                        
      1030,	--Gerente Irapuato                                            
      1031	--Gerente Patria               
    );

  select 
  *
  from evaluationSales e, positions p, employees em
    where month(e.monthEvaluated) = ${month}
    and year(e.monthEvaluated)= year(getDate())
    and e.employeeId = em.employeeID
    and em.position = p.positionID
    and em.position in ( 
      21,	--Gerente Federalismo                                         
      1024,	--Gerente León                                                
      1026,	--Gerente Urban                                               
      1027,	--Gerente Puebla                                              
      1028,	--Gerente Querétaro                                           
      1029,	--Gerente López Mateos                                        
      1030,	--Gerente Irapuato                                            
      1031	--Gerente Patria               
    );
  `;

  const response = { status: '', message: '', data:'', detail:'' };

  database.query(sql).then((r)=>{
    if(r != undefined)
    {
      response.status = 'success';
      response.message = 'Se obtuvieron las ventas del mes número: ' + month;
      response.data = r.recordset[0];
      response.detail = r.recordsets[1];
      res.send(response)

    }
    else{
      response.status = 'error';
      response.message = 'No se obtuvieron las ventas del mes número: ' + month;
      res.send(response)
    }
  })


} )

app.get('/globalExpenses', validToken, (req,res)=>{

  const month = req.query.month;
  const sql = `
  select SUM(monthAchieve)       monthTotalExpens , 
         SUM(monthGoal)          monthGoalExpens, 
         SUM(accumulatedAchieve) totalCumullatedExpens, 
         SUM(accumulatedGoal)    totalCumulatedGoalExpens
  from evaluationExpenses e, positions p, employees em
    where month(e.monthEvaluated) = ${month}
    and year(e.monthEvaluated)= year(getDate())
    and e.employeeId = em.employeeID
    and em.position = p.positionID
    and em.position in ( 
      21,	--Gerente Federalismo                                         
      1024,	--Gerente León                                                
      1026,	--Gerente Urban                                               
      1027,	--Gerente Puebla                                              
      1028,	--Gerente Querétaro                                           
      1029,	--Gerente López Mateos                                        
      1030,	--Gerente Irapuato                                            
      1031	--Gerente Patria               
    );

  select 
  *
  from evaluationExpenses e, positions p, employees em
    where month(e.monthEvaluated) = ${month}
    and year(e.monthEvaluated)= year(getDate())
    and e.employeeId = em.employeeID
    and em.position = p.positionID
    and em.position in ( 
      21,	--Gerente Federalismo                                         
      1024,	--Gerente León                                                
      1026,	--Gerente Urban                                               
      1027,	--Gerente Puebla                                              
      1028,	--Gerente Querétaro                                           
      1029,	--Gerente López Mateos                                        
      1030,	--Gerente Irapuato                                            
      1031	--Gerente Patria               
    );

  `;

  const response = { status: '', message: '', data:'', detail:'' };

  database.query(sql).then((r)=>{
    if(r != undefined)
    {
      response.status = 'success';
      response.message = 'Se obtuvieron los gastos del mes número: ' + month;
      response.data = r.recordset;
      response.detail = r.recordsets[1];
      res.send(response)

    }
    else{
      response.status = 'error';
      response.message = 'No se obtuvieron las gastos del mes número: ' + month;
      res.send(response)
    }
  })


} )

//para obtener los bonos por ventas del documento 
app.get('/salesBonus', validToken, SalesBonusController.getSalesBonus);

//las ventas acumuladas por tienda hasta el numero del mes indicado del año actual
app.get('/accumulatedSalesByStore_Month',validToken, AccumulatedSales.getAllStoresSales)

//los gastos acumuladas por tienda hasta el numero del mes indicado del año actual
AccumulatedExpens.databaseInstance = database;
app.get('/accumulatedExpensByStore_Month', validToken, AccumulatedExpens.getAllStoresExpens)

EvaluationCriteriaAverageController.setDataBaseInstance(database);
app.post('/evalCriteriaAverage', validToken, EvaluationCriteriaAverageController.saveEvalCriteriaAverage);

ActivityConditionController.databaseInstance = database;
app.post('/saveActivityCondition', validToken, ActivityConditionController.start);

DeductionsController.databaseInstance = database;
app.post('/viewDeduction',validToken,DeductionsController.main)
app.get('/viewDeduction',validToken,DeductionsController.main)

DocumentFinalAuth.databaseInstance = database;
app.get('/documentFinalAuth',validToken, DocumentFinalAuth.main)

EvaluationSummary.databaseInstance = database;
app.get('/evaluationSummary',validToken, EvaluationSummary.main)