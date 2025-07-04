//New integrated form 
// app.use(express.urlencoded({extended: false}));
// app.use(express.json());

const express = require('express')


const bcrypt = require('bcrypt-nodejs')

const cors = require('cors')

//Paquete knex que permite una conexión a una base de datos
const knex = require('knex')

const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const image = require('./controllers/image')

const db = knex({
client: 'pg',
connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'midvigil',
    password: 'toor',
    database: 'smart-brain',
},
});

const app = express();


app.use(express.json())
app.use(cors())

app.get('/', (req,res)=> {
    res.send(db.users)
})

app.post('/signin',(req,res)=> signin.handleSignIn(req,res,db,bcrypt));
app.post('/register',  (req,res) => register.handleRegister(req,res,db,bcrypt) )
app.get('/profile/:id', (req,res) => profile.handleProfileGet(req,res,db,bcrypt) )
app.put('/image',(req,res) => image.handleImage(req,res,db,bcrypt) )

app.listen(5001, () => {
    console.log("App is running on port 5001")
})

