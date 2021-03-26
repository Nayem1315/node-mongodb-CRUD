const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID

const password = 'UKuosnxYdjR8Cj3i'

const uri = "mongodb+srv://learningSchool:UKuosnxYdjR8Cj3i@cluster0.yecb1.mongodb.net/learningSchool?retryWrites=true&w=majority"
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})



// <!--Make CRUD operation working smoothly-->




//Client Site Or Fronted
client.connect(err => {
    const collection = client.db("learningSchool").collection("learn");
    app.get('/learn', (req, res) => {
        collection.find({})
            .toArray((err, document) => {
                res.send(document);
            })
    })
    //find single learn
    app.get('/learn/:id', (req, res) => {
        collection.find({ _id: ObjectID(req.params.id) })
            .toArray((err, document) => {
                res.send(document[0]);
            })
    })
    //Add New Learn
    app.post('/addLearn', (req, res) => {
        const learn = req.body;
        collection.insertOne(learn)
            .then(result => {
                console.log("learn Added successfully");
                res.redirect('/')
            })

    })

    //Update Learn
    app.patch('/update/:id', (req, res) => {
        console.log(req.body.params);
        collection.updateOne({ _id: ObjectID(req.params.id) },
            {
                $set: { price: req.body.price, quantity: req.body.quantity }
            })
            .then(result => {
                res.send(result.modifiedCount > 0)
            })
    })

    //delete learn
    app.delete('/delete/:id', (req, res) => {
        collection.deleteOne({ _id: ObjectID(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0);
            })
    })

});


app.listen(3000);