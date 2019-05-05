const express = require('express')
const app = express()
const port = 3000;

const MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID
const assert = require('assert');
var request = require("request");
// Connection URL
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'testing';
var db;
var collectionBikes;
var collectionWeather;

// Use connect method to connect to the server
MongoClient.connect(url, function (err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    db = client.db(dbName);
    collectionBikes = db.collection('test');
    collectionWeather = db.collection('test2');
});

// ------------------------------- getWeather --------------------------------------start

// downloading the data on each minute using crontab job
app.get('/api/getWeather/', function (req, res) {
    var options = {
        method: 'GET',
        url: 'https://samples.openweathermap.org/data/2.5/weather',
        qs: { q: 'London,uk', appid: 'b6907d289e10d714a6e88b30761fae22' },
        headers:
        {
            'Bearer-token': '9cb0ce83-de22-efbf-1495-ac03538c570c',
            'cache-control': 'no-cache'
        }
    };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        let newBody = JSON.parse(body)
        newBody.created_at = new Date();
        collectionWeather.insertOne(newBody, function (err, data) {
            if (err) throw err
            else {
                res.json(newBody)
            }
        });
    });
});


app.get('/weather', function (req, res) {

    const at = req.query.at;

    // required fields are below
    const lat = req.query.lat;
    const lon = req.query.lon;
    const cityName = req.query.name

    if (!req.query.name) {
        res.json({ Message: "City Name is required" })
    }
    else if (!req.query.lat) {
        res.json({ Message: "Latitude is required" })

    }
    else if (!req.query.lon) {
        res.json({ Message: "Longitude is required" })

    }
    else {
        collectionWeather.aggregate([
            {
                "$match": { "created_at": { "$gte": new Date(at) } }
            },  //find by specific date
            {
                "$unwind": "$coord"
            },
            {
                "$match": {
                    "name": cityName,
                    "coord.lat": Number(lat),
                    "coord.lon": Number(lon),
                }
            }
        ]
        ).toArray(function (err, data) {
            console.log(data)
            if (err) {
                res.json(err)
            }
            else {
                var results = {
                    at: at,
                    result: data
                }
                res.json(results);
            }
        })

    }
})

// ------------------------------- getWeather --------------------------------------end



// ------------------------------- getBikes --------------------------------------start

// downloading the data on each minute using crontab job
app.get('/api/getBike', function (req, res) {
    var options = {
        method: 'GET',
        url: 'https://www.rideindego.com/stations/json/',
        headers:
        {
            'Bearer-Token': '75ee6713-51e2-450b-9ab0-96e14c58c147',
            'cache-control': 'no-cache'
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        let newBody = JSON.parse(body)
        newBody.created_at = new Date();
        collectionBikes.insertOne(newBody, function (err, data) {
            if (err) throw err
            else {
                res.json(data)
            }
        });
    });
});



// this find the record as per specific given date
app.get('/api/v1/stations', function (req, res) {
    const at = req.query.at
    collectionBikes.findOne({ created_at: { "$gte": new Date(at) } }, function (err, data) {
        if (err) {
            res.json({ err: err })
        }

        res.json({ result: data });
    })

})

app.get('/api/v1/stations/:kioskId', function (req, res) {
    const at = req.query.at     //find by specific time
    const kioskId = req.params.kioskId    //find by id param

    collectionBikes.aggregate([
        {
            "$match": { created_at: { "$gte": new Date(at) } } //find by specific date
        },
        {
            "$unwind": "$features"
        },
        {
            "$match": {
                "features.properties.kioskId": Number(kioskId),
            }
        }
    ]
    ).toArray(function (err, data) {
        console.log(data)
        if (err) {
            res.json(err)
        }
        else {
            var results = {
                at: at,
                result: data
            }
            res.json(results);
        }
    })
})

//find by id and specific range of period

app.get('/api/v1/stations/:kioskId', function (req, res) {
    const from = req.query.from // from given time
    const to = req.query.to     // search by range of given time
    const kioskId = req.params.kioskId // as per id

    collectionBikes.aggregate([
        {
            "$match": {
                created_at: { $gte: new Date(from), $lte: new Date(to) }
            }
        },
        {
            "$unwind": "$features"
        },
        {
            "$match": {
                "features.properties.kioskId": Number(kioskId),
            }
        }
    ]
    ).toArray(function (err, data) {
        console.log(data)
        if (err) {
            res.json(err)
        }
        else {
            var results = {
                at: at,
                result: data
            }
            res.json(results);
        }
    })

})
// ------------------------------- getBikes --------------------------------------end--
// listening port 3000 (localhost:3000/api/v1/stations)

app.listen(port, () => console.log(`Challenges app listening on port ${port}!`))
module.exports = app;


// weather?lat=35&lon=139


// Developer: Sunjay Kumar (Sunny)