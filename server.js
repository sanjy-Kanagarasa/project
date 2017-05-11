var express = require('express');
var bodyparser = require('body-parser');
var passwordHash = require('password-hash');
var MongoClient = require('mongodb').MongoClient;
var request = require('request');
var objectId = require("mongodb").ObjectId;
var app = express();

// Static file hosting
app.use('/', express.static('client'));

// Connect to database
var db;
var studentsTable;
MongoClient.connect('mongodb://localhost:27017/ipProject', function (err, _db) {
    if (err) throw err; // Let it crash
    console.log("Connected to MongoDB");
    
    db = _db;
    
    db.createCollection("people", { size: 2147483648 } );
    users = db.collection('users'); // Save some keystrokes..
    schools = db.collection('schools');
    userData = db.collection('data');
    testData =  db.collection('testData');
});


// Disconnect after CTRL+C
process.on('SIGINT', function () {
    console.log("Shutting down Mongo connection");
    db.close();
    process.exit(0);
});
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.get('/api/users', function (req, res) {
    studentsTable.find().toArray(function (err, students) {
        // TODO Handle error
        res.status(200).json(students);
    });
});
app.use(bodyparser.json());

var url = 'https://thingspeak.com/channels/257227/feeds.json?results=40';

app.get('/api/data', function (req, res) {
 request({
        url: url,
        json: true
    }, function (error, response, body) {

        res.status(200).json(body);
    });
});
app.post('/api/createUser', function (req, res) {
    users.findOne({
        "email": req.body.email
    }, function (error, user) {
        if (user) {
            console.log("email in use");
            res.status(201).json({
                "text": "Email already in use",
                "class": "info_show info_red",
                "succes": false
            });
        } else {

            var newUser = {
                'name': {
                    'firstname': req.body.firstname,
                    'lastname': req.body.lastname
                },
                'email': req.body.email,
                'password': passwordHash.generate(req.body.password),
                'phone': req.body.phone,
                'address': {
                    'street': req.body.street,
                    'nr': req.body.nr,
                    'zipcode': req.body.zipcode,
                    'place': req.body.place,
                    'country': req.body.country
                },
                'birthday': new Date(req.body.bday),
                'type': req.body.type,
                'school': req.body.school,
                'class': req.body.class
            }
            users.insert(newUser, function (error, result) {
                if (error) {
                    res.status(400).json({
                        "text": "error",
                        "class": "info_show info_red",
                        "succes": false
                    });
                } else {
                    res.status(201).json({
                        "text": "User was successfully created.",
                        "class": "info_show info_green",
                        "succes": true
                    });
                }
            });
            
        }
    });


});
app.post('/api/loginUser', function (req, res) {
    users.findOne({
        "email": req.body.email
    }, function (error, user) {
        if (user) {
                if (passwordHash.verify(req.body.password, user.password)) {
                    var u = user;
                    u.password = null;
                    res.status(200).json({
                        "text": "Login succes",
                        "class": "info_show info_green",
                        "succes": true,
                        "user": u
                    });
                } else {
                    res.status(200).json({
                        "text": "Password incorrect",
                        "class": "info_show info_red",
                        "succes": false
                    });
                }
        } else {
            res.status(200).json({
                "text": "User not found",
                "class": "info_show info_red",
                "succes": false
            });
        }
    });
});

app.post('/api/deleteUser', function (req, res) {
    newUser = {
        'name': req.body.name,
        'firstname': req.body.firstname
    };
    studentsTable.deleteOne(newUser, function (err, result) {
        // TODO Handle error 
        studentsTable.find().toArray(function (err, persons) {
            // TODO Handle error
            res.status(200).json(persons);
            console.log('Item deleted ' + req.body.name);
        });
    });
});


app.get('/api/schools', function (req, res) {
   
           schools.find().toArray(function (err, schools) {
            // TODO Handle error
            res.status(200).json(schools);
        });
});
app.get('/api/classes', function (req, res) {

    schools.findOne({
        "_id": objectId(req.query.schoolid)
    }, function (error, school) {

        res.status(201).json(school.classes);
    });
});

app.get('/api/charts/oneUser', function (req, res) {

    userData.find().toArray(function (err, data) {
            // TODO Handle error
            res.status(200).json(data);
        });
});


app.listen(3000);