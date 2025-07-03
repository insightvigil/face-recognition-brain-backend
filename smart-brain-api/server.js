//New integrated form 
// app.use(express.urlencoded({extended: false}));
// app.use(express.json());

const express = require('express')

const app = express();

const bcrypt = require('bcrypt-nodejs')

const cors = require('cors')

//Paquete knex que permite una conexión a una base de datos
const knex = require('knex')

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

/*
db.select('*').from('users').then(data => {
    console.log(data)
})
*/



app.use(express.json())
app.use(cors())

const database = {
    users: [
        {   
            id: '1',
            name: 'Adrian',
            email: 'adrianflores@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {   
            id: '2',
            name: 'Pao',
            email: 'pao@gmail.com',
            password: 'cookies2',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '1',
            hash: '',
            email: 'adrianflores@gmail.com'
        }
    ]
}

app.get('/', (req,res)=> {
    res.send(database.users)
})

app.post('/signin',(req,res) => {
    db.select('email', 'hash').from('login')
    .where('email','=', req.body.email)
    .then(data=> {
        const isValid = bcrypt.compareSync(req.body.password,data[0].hash);
        if(isValid) {
            console.log(isValid)
            return db.select('*').from('users')
                .where('email','=',req.body.email)
                .then(user => {
                    res.json(user[0])
                })
                .catch(err => res.status(400).json('Unable to get user'))
        }
        else {
            console.log(isValid)
            res.status(400).json('wrong credentials')
        }  
    })
    .catch(err => res.status(400).json('wrong credentials'))

    });


app.post('/register', (req,res) => {
    const {email, name, password} = req.body
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0].email,
                name: name,
                joined: new Date()
            })
            .then(user=> {res.json(user[0]);

            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('Unable to register'))
})

app.get('/profile/:id', (req,res) => {
    const { id } = req.params;
    db.select('*').from('users').where({id})
    .then(user => {
        if(user.length) {
            res.json(user[0])
        }
        else {
            res.status(400).json('User not found')
        }
    })
       
})

app.put('/image', (req,res) => {
    const { id } = req.body;
    db('users')
    .where('id','=',id)
    .increment('entries',1)
    .returning('entries')
    .then(entries => { 
        res.json(entries[0].entries)
    })
    .catch(err => { res.status(400).json('Unable to count')})
    
})


/*


*/
app.listen(5001, () => {
    console.log("App is running on port 5001")
})

/*
/ --> res = this is working
/sigin --> POST = sucess/fail
/register --> POST = user
/profile:userId --> GET = user
/image --> PUT --> user
*/

/*
.insert({
  // If you are using Knex.js version 1.0.0 or higher this 
  // now returns an array of objects. Therefore, the code goes from:
  // loginEmail[0] --> this used to return the email
  // TO
  // loginEmail[0].email --> this now returns the email
     email: loginEmail[0].email, // <-- this is the only change!
     name: name,
     joined: new Date()
})
     */

/*
     //true
    bcrypt.compareSync("veggies",hash);//false
    */