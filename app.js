const express = require('express');
const mysql = require('mysql');
const app = express();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'quiz-api'
});

//to get all quizes
app.get('/', (req, res) => {
    let sql = 'SELECT * FROM quiznames';
    let query = db.query(sql, (err, result) => {
        if(err) {
            res.send('Error in FETCHING!!!');
        }
        else {
            res.send(result);
        }
    });
});

//to get questions of each quiz
app.get('/quiz/:quizName', (req, res) => {
    let data = {
        quizName: req.params.quizName
    };
    // console.log(data.quizName)
    let sql = `SELECT * FROM ${data.quizName}`;
    let query = db.query(sql, (err, result) => {
        if(err) {
            res.send('Quiz not FOUND!!');
        }
        else {
            res.send(result);
        }  
    })
})

app.listen(3000, () => {
    console.log('Server running at 3000...');
})