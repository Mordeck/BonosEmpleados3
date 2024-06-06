
class ScheduledTaskManager {

    tasks = [];

    constructor() {

    }

    addTask({task, schedule}) {
        this.tasks.push({task, schedule})
    }

    /**
     * 
     * @param {*} every time to check again in milisecons
     */
    RunTasksChecker(every) {
        const today = new Date();
        //console.log("revisando ejecusion de tareas: " + new Date().toLocaleString());

        //console.log(this.tasks);
        

        this.tasks.forEach(({ task, schedule }) => {
            //console.log("revisando la tarea", task.constructor.name, new Date().toLocaleString());

            //console.log("comparando dia se la semana", schedule.day, " con ", today.getDay());
            
            if (  schedule.day == today.getDay() )
            {
            task.run(); 
            }
            
        });

        setInterval(
            () => {
                this.RunTasksChecker(every)
            }, every
        )
    }


}

class GenerateEvaluations {
    constructor(dbconnection) {
        this.dbconnection = dbconnection;
    }

    run(){
        this.getActivities();
    }


    getActivities() {
        console.log("obteniendo las actividades");
        const date = new Date();
        //mes anterior 
        let month = date.getFullYear() + "-" + (date.getMonth() - 1).toString().padStart(2, '0');

        const today = date.getFullYear() + '-' + (date.getMonth()).toString().padStart(2, '0') + '-' + (date.getDay()).toString().padStart(2, '0');
        const sql =
            `
                    IF OBJECT_ID('tempdb..#TempSplitRows') IS NOT NULL
                        DROP TABLE #TempSplitRows;
            
                    CREATE TABLE #TempSplitRows (
                          activityId INT,
                          description VARCHAR(MAX),
                          monthToEvaluate VARCHAR(7),
                          evaluated INT,
                          evaluator INT,
                          finishdate DATE
                        );

                    -- se crean las posibles evaluaciones del mes pasado
                    INSERT INTO #TempSplitRows ( monthToEvaluate, evaluated, evaluator, activityId, finishdate)
                    SELECT

                        concat( year(getdate()), '-', month(getdate())-1 ) AS monthToEvaluate,
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
                        STRING_SPLIT(ISNULL(d.userPosition, ''), ',') -- Split the evaluated field;


                    -- validamos si las evaluaciones no han sido generadas
					insert into evaluations
					SELECT monthToEvaluate, evaluated, evaluator, r.activityId, null finish FROM #TempSplitRows r
					LEFT JOIN EvaluationsLog e ON r.activityId = e.activityId
                    AND e.monthToEvaluated = r.monthToEvaluate
					WHERE e.activityId IS NULL
					OR e.monthToEvaluated IS NULL
					order by e.activityId;

                    --si se generaron nuevas, se inserta en la bitacora 
					insert into evaluationslog
					SELECT r.monthToEvaluate, getdate(), r.activityId FROM #TempSplitRows r
					LEFT JOIN EvaluationsLog e ON r.activityId = e.activityId
                    AND e.monthToEvaluated = r.monthToEvaluate
					WHERE e.activityId IS NULL
					OR e.monthToEvaluated IS NULL
					order by e.activityId;

                    --
                    select * from evaluations 
                `;

        console.log(sql);

        this.dbconnection.query(sql, (e) => { console.log(e); }).then((result) => {
            console.log("el result");
            console.log(result);
            if (result != undefined)
            {

                if (result.rowsAffected[2] > 0) {
                    console.log("se han generado las evaluaciones del mes:", month);
                }
            } else {
                console.log('Hubo un error en el query');
            }
        });
    }

    shouldRun() {
        console.log("Deberia ejecutarse?");
        const date = new Date();
        const monthEvaluations = date.getFullYear() + '-' + (date.getMonth() - 1).toString().padStart(2, 0)
        const sql = `SELECT * FROM evaluationslog WHERE monthToEvaluated ='${monthEvaluations}'`;
        console.log(sql);

        this.dbconnection.query(sql, (e) => { console.log("el error esta aqui"); console.log(e); }).then((result) => {
            //console.log(result);
            if (result.rowsAffected > 0) {
                console.log("No debe ejecutarse")
                return false;
            }

            else {
                console.log("si debe ejecutarse")
                this.getActivities();
            }
        })
            .catch((error) => {
                console.log("sucedio un error");
                console.log(error);
            })

    }

}

module.exports = { ScheduledTaskManager, GenerateEvaluations }