// const path = require('path')
const express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const morgan = require('morgan')
const app = express()

app.use(morgan('tiny'))

// se è in locale in MAMPP
const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'node_crud'
})

connection.connect((error) => {
    if(error) { console.log(error); process.exit(-1); }
    else console.log('Connection to database MySQL successful')
})

//set views file
// app.set('views',path.join(__dirname,'views'))
			
//set view engine
app.set('view engine', 'ejs')

// necessario per il funzionamento dei form
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.redirect('/users')
})

app.get('/users', (req, res) => {
    const sql = "SELECT * FROM users"
    const query = connection.query(sql, (err, rows) => {
        if(err) throw err
        res.render('index', {
            title : 'CRUD Operation using NodeJS / ExpressJS / MySQL',
            users : rows
        })
    })
})

app.get('/add', (req, res) => {
    res.render('new', {
        title : 'Add user'
    })
})

app.post('/save', (req, res) => { 
    const data = {
      name: req.body.name, 
      email: req.body.email, 
      phone_no: req.body.phone_no
    }

    const sql = "INSERT INTO users SET ?"
    const query = connection.query(sql, data, (err, result) => {
      if (err) throw err
      console.log('result:', result)
      res.redirect('/')
    })
})

app.get('/edit/:userId', (req, res) => {
    const userId = req.params.userId
    const sql = `SELECT * FROM users WHERE id = ${userId}`
    const query = connection.query(sql, (err, results) => {
        if (err) throw err
        console.log('results:', results)
        res.render('edit', {
            title : 'Edit user',
            user : results[0]
        })
    })
})

app.post('/update',(req, res) => {
    const userId = req.body.id
    // const sql = "UPDATE users SET name='" + req.body.name + "',  email='" + req.body.email + "',  phone_no='" + req.body.phone_no + "' where id =" + userId
    const sql = `UPDATE users SET name='${req.body.name}',  email='${req.body.email}',  phone_no='${req.body.phone_no}' WHERE id=${userId}`
    const query = connection.query(sql, (err, result) => {
      if(err) throw err
      console.log('result:', result)
      res.redirect('/')
    })
})

app.get('/delete/:userId', (req, res) => {
    const userId = req.params.userId
    const sql = `DELETE FROM users WHERE id = ${userId}`
    const query = connection.query(sql, (err, result) => {
        if(err) throw err
        console.log('result:', result)
        res.redirect('/')
    })
})

// Server Listening
app.listen(3000, () => {
    console.log('Server is running at port 3000')
})
