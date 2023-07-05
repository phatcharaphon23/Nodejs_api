// const users = require('./db')
let express = require("express");
let app = express();
let port = process.env.PORT || 3000;
let bodyParser = require('body-parser');
let mysql = require('mysql');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true}));

// connection.connect();
app.get("/", (req, res) => {
  res.send("Hello! Node.js");
})

// connection mysql database
let dbcon = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node_api'
})
dbcon.connect();
//retrive all account
app.get('/account', (req, res) => {
    dbcon.query('SELECT * FROM account', (error, results, fields) => {
        if (error) throw error;

        let message = ""
        if (results === undefined || results.length == 0) {
            message = "Account table empty";
        } else {
            message = "Successfully retrieved ";
        }
        return res.send({ error: false, data: results, message: message});
    })
}); 

// add a new account 
app.post('/accounts', (req, res) => {   
    // account.push(req.body)
    let name = req.body.name;
    let password = req.body.password;
    
    // Validation
    if (!name || !password) {
        return res.status(400).send({ error: true, message: "กรุณากรอกข้อมูลให้ครบ" });
    } else {
        dbcon.query('INSERT INTO account (name, password) VALUES(?, ?)', [name, password], (error, results, fields) => {
            if (error) throw error;
            return res.send({ error: false, data: results, message: "account" })
        })
    }
});

// retrive account by id
app.get('/accounts/:id', (req, res) => {
    let id = req.params.id;

    if (!id) {
        return res.status(400).send({ error: true, message: "Please provide account id"});
    } else {
        dbcon.query("SELECT * FROM account WHERE id = ?", id, (error, results, fields) => {
            if (error) throw error;

            let message = "";
            if (results === undefined || results.length ==0) {
                message = "account not found";
            } else {
                message = "Successfully retrieved account data"
            }
            return res.send({ error: false, data: results[0], message: message})
        })
    }
})

// update account with id
app.put('/accounts', (req, res) => {
    let id = req.body.id;
    let name = req.body.name;
    let password = req.body.password;

    // Validation
    if (!id || !name || !password) {
        return res.status(400).send({ error: true, message: "Please provide account id, name, and password" });
    } else {
        // Perform the database update query
        dbcon.query('UPDATE account SET name = ? WHERE id = ?', [name, id], (error, results, fields) => {
            if (error) throw error;

            let message = "";
            if (results.changedRows === 0) {
                message = "Account not found or data are the same";
            } else {
                message = "Account successfully updated";
            }

            return res.send({ error: false, data: results, message: message });
        });
    }
})

// delete account by id
app.delete('/accounts', (req, res) => {
    let id = req.body.id;

    if (!id) {
        return res.status(400).send({ error: true, message: "Please provide account id"});
    } else {
        dbcon.query('DELETE FROM account WHERE id = ?', [id], (error, results, fields) => {
            if (error) throw error;

            let message = "";
            if (results.affectedRows === 0) {
                message = "Account not found";
            } else {
                message ="Account successfully deleted";
            }
            return res.send({error: false, data: results, message: message})
        })
    }
})


app.listen(port, () => {
  console.log("Starting node.js at port " + port);
});