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

    db.createCollection("people", {
        size: 2147483648
    });
    users = db.collection('users'); // Save some keystrokes..
    schools = db.collection('schools');
    userData = db.collection('data');
    testData = db.collection('testData');
    classes = db.collection('classes');
    students = db.collection('students');
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

var url = 'https://thingspeak.com/channels/274791/feeds.json?results=50';

app.get('/api/data', function (req, res) {
    //console.log(req.query.id);
    students.findOne({
        _id: objectId(req.query.id)
    }, function (error, student) {
        if (student) {
            request({
                url: 'https://thingspeak.com/channels/' + student.ChannelId + '/feeds.json?results=50',
                //url: url,
                json: true
            }, function (error, response, body) {

                res.status(200).json({
                    //delete student.ChannelId
                    "body": body,
                    "student": student,
                    "succes": false,
                    "number": req.query.nmr
                });
            });

        } else {
            res.status(201).json({
                "text": "student not found.",
                "class": "info_show info_red",
                "succes": false
            });
        }
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
                delete user.password;
                res.status(200).json({
                    "text": "Login succes",
                    "class": "info_show info_green",
                    "succes": true,
                    "user": user
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

/*
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

*/

app.post('/api/addStudent', function (req, res) {
    var ChannelIdIn;
    var newStudent = {};
    request({
        url: 'https://api.thingspeak.com/channels.json',
        method: 'POST',
        headers: {
            name: 'content-type',
            value: 'application/x-www-form-urlencoded'
        },
        body: {
            api_key: 'XF2O4DZK4L6ITEM2',
            name: req.body.firstname
        },
        json: true
    }, function (error, response, body) {
        ChannelIdIn = body.id;
        var newStudent = {
            'firstname': req.body.firstname,
            'lastname': req.body.lastname,
            'classId': req.body.classId,
            'ChannelId': ChannelIdIn
        }
        students.insert(newStudent, function (error, result) {
            if (error) {
                res.status(400).json({
                    "text": "error",
                    "class": "info_show info_red",
                    "succes": false
                });
            } else {
                res.status(201).json({
                    "text": "studens was successfully added.",
                    "class": "info_show info_green",
                    "succes": true,
                    "students": result
                });
            }
        });
    });

});
app.post('/api/addClass', function (req, res) {
    var newClass = {
        'name': req.body.name
    }
    classes.findOne({
        'name': req.body.name
    }, function (error, result) {
        if (result) {
            res.status(200).json({
                "text": "class is alredy in use",
                "class": "info_show info_red",
                "succes": false
            });

        } else {
            classes.insert(newClass, function (error, result) {
                if (error) {
                    res.status(400).json({
                        "text": "error",
                        "class": "info_show info_red",
                        "succes": false
                    });
                } else {
                    res.status(201).json({
                        "text": "class was successfully added.",
                        "class": "info_show info_green",
                        "succes": true
                    });
                }
            });
        }
    });

});

app.get('/api/schools', function (req, res) {

    schools.find().toArray(function (err, schools) {
        // TODO Handle error
        res.status(200).json(schools);
    });
});
app.post('/api/getClasses', function (req, res) {

    classes.find().toArray(function (err, data) {
        // TODO Handle error
        res.status(201).json({
            "succes": true,
            "classes": data
        });
    });
});

app.post('/api/getStudents', function (req, res) {
    students.find({
        "classId": req.body.classId
    }).toArray(function (err, data) {
        // TODO Handle error
        res.status(201).json({
            "succes": true,
            "students": data
        });
    });
});
app.listen(80);
