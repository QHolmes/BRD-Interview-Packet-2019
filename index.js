const express = require('express')
const app = express()
const port = 3000
app.use(express.json())

// Setup the DB
var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database(':memory:')

//Setup CSV, using npm install csv-parser
const csv = require('csv-parser')
const fs = require('fs')
let peopleDataHeaders = ["first_name", "last_name", "gender", "age"];



// list of people, gender, age, name, email, address
db.serialize(function () {
    // Add additional DB setup inside this function
    db.run('CREATE TABLE score_data (name TEXT, score INT)')
    var stmt = db.prepare('INSERT INTO score_data VALUES (?, ?)')

    data = [['Kyle', 1], ['Danny', 5], ['Drew', 0], ['Duane', 1], ['Jacob', 2], ['Michael', 2]];
    data.forEach(x => {
        stmt.run(x[0], x[1])
    });


    stmt.finalize()

    db.each('SELECT rowid AS id, name, score FROM score_data', function (err, row) {
        //console.log(row.id + ': ' + row.info)
        console.log(row)
    })

    db.run('CREATE TABLE people_data (first_name TEXT, last_name TEXT, gender TEXT, age INT)')
    loadCSV();
    sortParse();
})

//aggregates gender data
app.get('/countGender', (req, res) => {
    db.all('SELECT gender, COUNT(gender) as total FROM people_data GROUP BY gender', (err, rows) => {
        if (err) {
            console.log('DB Error ', err);
            res.send('[]')
        } else {
            //format to chart.js input
            const labels = [];
            const dataset = {
                data: [],
                backgroundColor: []
            };
            rows.forEach(row => {
                labels.push(row.gender);
                dataset.data.push(row.total);
                dataset.backgroundColor.push(row.gender.toLowerCase() === 'male' ? '#26c6da' : '#ef5350');
            });

            const result = {
                labels: labels,
                datasets: [dataset]
            };
            res.json(result);
        }
    })
});

//inserts a row into the people_data table
app.post('/addPerson', (req, res) => {
    console.log(req.body)
    db.run("INSERT INTO people_data ('first_name', 'last_name', 'gender', 'age') VALUES (?, ?, ?, ?)",
        [req.body.firstName.toLowerCase(), req.body.lastName.toLowerCase(), req.body.gender.toLowerCase(), req.body.age], function (err, row) {
            if (err) {
                res.json(false)
            } else {
                res.json(true)
            }
        }
    )
})

app.get('/getPeople', (req, res) => {
    let search = req.query["search"];
    let sort = req.query["sort"]; //Should be in the format of "first_name:asc,last_name:dec"

    let where = "";
    let orderBy = " ORDER BY last_name ASC, first_name ASC";


    //Ready the where clause, if needed
    if(search){
        //Only allow numbers, letters, and whitespace
        let searchParts = search.replace(/[^a-z0-9 ]/gi,'').toLowerCase().split(" ");
        where = " WHERE ";

        for(let j = 0; j < searchParts.length - 1; j++){
            where += " (";
            for(let i = 0; i < peopleDataHeaders.length - 1; i++) {
                where += " " + peopleDataHeaders[i] + " LIKE '%" + searchParts[j] +"%' OR ";
            }
            where += " " + peopleDataHeaders[peopleDataHeaders.length - 1] + " LIKE '%" + searchParts[j] +"%') AND";
        }

        where += " (";
        for(let i = 0; i < peopleDataHeaders.length; i++) {
            where += " " + peopleDataHeaders[i] + " LIKE '%" + searchParts[searchParts.length - 1] +"%' OR ";
        }
        where += " " + peopleDataHeaders[peopleDataHeaders.length - 1] + " LIKE '%" + searchParts[searchParts.length - 1] +"%') ";
    }

    //Change the ORDER BY if needed
    let orderParam;
    if(sort) {
        orderParam = {};
        let parts = sort.split(",");
        for(let i = 0; i < parts.length; i++){
            let item = parts[i].split(":");
            if (peopleDataHeaders.find(x => x === item[0]))
                if(item[1].toLowerCase() === 'asc' || item[1].toLowerCase() === 'desc')
                    orderParam[i] = {col: item[0], sort: item[1]};
        }

        orderBy = " ORDER BY"
        for(let i = 0; i < Object.keys(orderParam).length - 1; i++){
            orderBy += " " + orderParam[i]["col"] + " " + orderParam[i]["sort"] + ", ";
        }

        orderBy += orderParam[Object.keys(orderParam).length  - 1]["col"] + " "
            + orderParam[Object.keys(orderParam).length - 1]["sort"] + " ";
    }

    //send the request and return
    let query = 'SELECT * FROM people_data ' + where + orderBy;
    db.all(query, function (err, rows) {
        if (err) {
            console.log('DB Error ', err)
            res.json([]);
        } else {
            res.json(rows)
        }
    })
})

// app.get('/', (req, res) => res.send('Hello World!'))
app.get('/', (req, res) => res.redirect('/index.html'))
app.get('/scores', (req, res) => {
    db.all('SELECT rowid as id, name, score from score_data', (err, rows) => {
        if (err) {
            console.log('DB Error ', err)
            // send an empty list to not error out the client that is expecting json
            res.send('[]')
        } else {
            res.send(JSON.stringify(rows))
        }
    })
});

//aggregates gender data
app.get('/countAge', (req, res) => {
    let count = req.query.count;
    //If count was requested, take input, else default to 6
    if(count == null || count < 1 || isNaN(count))
        count = 6;

    var ageRange;
    var maxAge;
    db.get('SELECT MAX(age) AS max' +
        ' FROM people_data', (err, rows) => {
        var groups = [count];
        if(err != null){
            colsole.log("DB ERROR ", err);
            res.send('[]');
        }else{
            maxAge = rows["max"];
            ageRange = Math.ceil((maxAge + 1) / count);
            var request = "";

            if (count > 1) {
                request += "SELECT t.age, COUNT(*) AS amount";
                request += " FROM( Select case ";

                var starting = 0;
                var ending = ageRange - 1;
                for (let x = 0; x < count - 1; x++) {
                    request += " WHEN age between "
                        + starting + " and "
                        + ending + " then '"
                        + starting + "-"
                        + ending + "'";
                    groups[x] = {age: starting + "-" + ending, amount: 0};
                    starting += ageRange;
                    ending += ageRange;
                }

                request += " ELSE '" + starting + "-" + ending + "' END AS age";
                request += " FROM people_data) t"
                request += " GROUP BY t.age"
                groups[count - 1] = {age: starting + "-" + ending, amount: 0};
            } else {
                request += "SELECT age, COUNT(*) AS amount " +
                    " FROM people_data";
            }

            db.all(request, (err, rows) => {
                if (err) {
                    console.log('DB Error ', err);
                    res.send('[]')
                } else {
                    //format to chart.js input
                    const labels = [];
                    const dataset = {
                        data: [],
                        label: 'Number of People in Age Group',
                        backgroundColor: []
                    };

                    if(count > 1) {
                        var amount;
                        groups.forEach(gr => {
                            amount = rows.find(x => x["age"] === gr["age"])
                            if (amount)
                                gr["amount"] = amount["amount"];
                            labels.push(gr["age"]);
                            dataset.data.push(gr["amount"]);
                            dataset.backgroundColor.push('#26c6da');
                        })
                    }else{
                        labels.push("0-" + maxAge);
                        dataset.data.push(rows[0]["amount"]);
                        dataset.backgroundColor.push('#26c6da');
                    }


                    const result = {
                        labels: labels,
                        datasets: [dataset]
                    };
                    res.json(result);
                }
            })
        }
    });



});

app.use(express.static('frontend/dist/'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

function loadCSV(){
    console.log("Reading in data.csv")
    var results = [];
    fs.createReadStream('data.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('headers', (headers => {

        }))
        .on('end', () => {
            addData(results)
        });

}

function addData(results){
    //Time to create the database
    //db.run('CREATE TABLE people_data (first_name TEXT, last_name TEXT, gender TEXT, age INT)')

    console.log("Adding data.csv to people_data")

    //Prepare statment
    var stmt = db.prepare('INSERT INTO people_data VALUES (?, ?, ?, ?)', x => {
        //If there is an error, print to consol
        if(x != null)
            console.log(x)
    })

    //Add each row from CSV
    results.forEach(x => {
        stmt.run(x["name.first"], x["name.last"], x["gender"], x["dob.age"])
    });

    //finalize statement to send
    stmt.finalize(x => {
        console.log("Completed adding data.csv to people_data")

        //Print out each row so we know it's there
        var count = 6;
        db.each('SELECT *' +
            'FROM people_data'
            , function (err, row) {
                if(err != null)
                    console.log(err);
            }, (error, num) => {
                console.log(num + " rows read -- " + results.length + " expected")

            });

        var ageRange;
        var maxAge;
        var groups = [];
        db.get('SELECT MAX(age) AS max' +
            ' FROM people_data', (err, rows) => {
            if(err != null){
                colsole.log("DB ERROR ", err);
                res.send('[]');
            }else {
                maxAge = rows["max"];
                ageRange = Math.ceil((maxAge + 1) / count);
                var request = "";

                if (count > 1) {
                    request += "SELECT t.age, COUNT(*) AS amount";
                    request += " FROM( Select case ";

                    var starting = 0;
                    var ending = ageRange - 1;
                    for (let x = 0; x < count - 1; x++) {
                        request += " WHEN age between "
                            + starting + " and "
                            + ending + " then '"
                            + starting + "-"
                            + ending + "'";
                        groups[x] = {age: starting + "-" + ending, amount: 0};
                        starting += ageRange;
                        ending += ageRange;
                    }

                    request += " ELSE '" + starting + "-" + ending + "' END AS age";
                    request += " FROM people_data) t"
                    request += " GROUP BY t.age"
                    groups[count - 1] = {age: starting + "-" + ending, amount: 0};
                } else {
                    request += "SELECT age, COUNT(*) AS amount " +
                        " FROM people_data";
                }


                var amount = null;
                db.all(request, (err, rows) => {

                    groups.forEach(gr => {
                        amount = rows.find(x => x["age"] === gr["age"])
                        if(amount)
                            gr["amount"] = amount["amount"];
                    })

                });
            }
        });

    })
}

function sortParse(){
    let sort = "first_name:asc, last_name:hello, yellow:ASC"
    let orderParm;
    if(sort) {
        orderParm = {};

        let parts = sort.split(",");
        for(let i = 0; i < parts.length; i++){
            let item = parts[i].split(":");
            if (peopleDataHeaders.find(x => x === item[0]))
                if(item[1].toLowerCase() === 'asc' || item[1].toLowerCase() === 'desc')
                    orderParm[i] = {col: item[0], sort: item[1]};
        }
    }
    console.log(orderParm)
}
// db.close()
