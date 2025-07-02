//New integrated form 
// app.use(express.urlencoded({extended: false}));
// app.use(express.json());

const express = require('express')

const app = express();

const bcrypt = require('bcrypt-nodejs')

const cors = require('cors')

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
    // Load hash from your password DB.
    bcrypt.compare("JOd",'$2a$10$m.XsLiyiN4myK6FdRFWZDOkl077k3Dz723V/cyiUqWLoDqxNYaCA2'
, function(err, res) {
        // res == true
        console.log('first guess',res)
    });

    
    bcrypt.compare("veggies", "$2a$10$m.XsLiyiN4myK6FdRFWZDOkl077k3Dz723V/cyiUqWLoDqxNYaCA2", function(err, res) {
        // res = false
        console.log('second guess', res)
    });


    if(req.body.email === database.users[0].email && req.body.password === database.users[0].password ){
    res.json('SUCCESS')
    }

    else {
        console.log(req.body.email)
        console.log(req.body.password)
        console.log(database.users[0])
        res.status(400).json('Error Login in');
    }
})

app.post('/register', (req,res) => {
    const {email, name, password} = req.body
    
    bcrypt.hash(password, null, null, function(err, hash) {
    // Store hash in your password DB.

    console.log(hash);
    });
    
    database.users.push({
        id: '3',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    })

    res.json(database.users[database.users.length-1])

})

app.get('/profile/:id', (req,res) => {
    const { id } = req.params;
    let found =false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        } 
    })
        if (!found) {
            res.status(400).json('not found')
        }
})

app.put('/image', (req,res) => {
    const { id } = req.body;
    let found =false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++
            return res.json(user.entries);
        } 
    })
        if (!found) {
            res.status(400).json('not found')
        }
    
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