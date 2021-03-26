const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var configDB = require('./config/database.js')
var db, collection;


//Setup server and connect database
app.listen(3000, () => {
    MongoClient.connect(configDB.url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(configDB.dbName);
        console.log("Connected to `" + configDB.dbName + "`!");
    });
});
//Generate html on fly via EJS || templtate language to get data and generate it to html
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('communityVibe').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {messages: result})
  })
})

app.post('/vibe', (req, res) => {
  db.collection('communityVibe').insertOne({
    vibe:req.body.vibe
  }, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    db.collection('communityVibe').find().toArray((err,result) => {
      if(err) return console.log(err)
      let total = 0
      result.forEach(item=>{
        total+=parseInt(item.vibe)
      })

      console.log(total/result.length)
      if(total){
        res.send({isChill:  (total/result.length)>=5})
      }

    })
  })
})

app.put('/messages', (req, res) => {
  db.collection('messages')
  .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
    $set: {
      thumbUp:req.body.thumbUp + 1
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.put('/tDown', (req, res) => {
  db.collection('messages')
  .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
    $set: {
      thumbDown:req.body.thumbDown + 1
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/messages', (req, res) => {
  db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
