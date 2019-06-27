const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
// const _ = require('lodash')

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: true}));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'quiz-api'
});

//to get all quizes
app.get('/quiz', (req, res) => {
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
app.get('/quiz/questions/:quizName', (req, res) => {
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
            // to remove answer row
            for(var i in result) {
                delete result[i].answer;
                delete result[i].weightage;
                // console.log(result)
            }
            res.send(result);
        }  
    });
});

//to submit solution of a quiz
app.post('/quiz/answers/:quizName', (req, res) => {
    let data = req.body;
    // console.log(data)
    var ans = [];
    let query = db.query(`SELECT id, answer, weightage FROM ${req.params.quizName}`, (err, result) => {
        var marksCount = 0;
        for(var i in result) {
            for(var j in data) {
                if(result[i].id == data[i].id && result[i].answer == data[i].answer) {
                    // count = count + a.weightage;
                    marksCount += result[i].weightage;
                    // console.log(`${result[i].id}: ${result[i].answer} - ${data[i].id}: ${data[i].answer} correct - ${count}`)
                }
                else {
                    marksCount -= (result[i].weightage / 4);
                    // console.log(`${result[i].id}: ${result[i].answer} - ${data[i].id}: ${data[i].answer} wrong - ${count}`)
                }
                break;
            }
        }
        res.send(`Total marks - ${marksCount}`);
    })
});

app.listen(3000, () => {
    console.log('Server running at 3000...');
});