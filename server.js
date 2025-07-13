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
    host: 'dpg-d1q0ln49c44c73940tog-a.oregon-postgres.render.com',
    port: 5432,
    user: 'mydb_gqg9_user',
    password: 'lJAJ9TC0DKvTQnX1UUMK1Pb7t201SyHp',
    database: 'myDB',
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

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`)
})

console.log(PORT)
