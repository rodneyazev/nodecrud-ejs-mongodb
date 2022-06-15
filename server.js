console.log('A força está com você.')

const express = require('express')
const bodyParser = require('body-parser')
var ObjectId = require('mongodb').ObjectID;
const app = express()


const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("mongodbrdn").collection("mongodbrdn");
  // perform actions on the collection object
  db = client.db('mongodbrdn');
  app.listen(3000, function (){
    console.log('Server running on port 3000.')
  })
  
});



app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs')

app.get('/',  (req, res) => {
  res.render('index.ejs');
  client.close();
});

app.get('/', (req, res) => {
  var cursor = db.collection('mongodbrdn').find();
  client.close();
})

app.get('/show', (req, res) => {
  db.collection('mongodbrdn').find().toArray((err, results) => {
      if (err) return console.log(err)
      res.render('show.ejs', { mongodbrdn: results })

  })
  client.close();
})


app.post('/show', (req, res) => {
  db.collection('mongodbrdn').insertOne(req.body, function (err, result){
    if(err) return console.log(err)
    console.log('Salvo no bando de dados.')
    res.redirect('/show')
    db.collection('mongodbrdn').find().toArray(function(err, results){
      console.log(results)
    })
  })
  client.close();
})

app.route('/delete/:id')
  .get((req, res) => {
    
      var id = req.params.id
      db.collection('mongodbrdn').deleteOne({_id : ObjectId(id)}, (err, result) => {
        if (err) return res.send(500, err)
        console.log('Deletado do Banco de Dados!')
        res.redirect('/show')
    })
  client.close();
  })

app.route('/edit/:id')
  .get((req,res) => {
    var id = req.params.id
    db.collection('mongodbrdn').find(ObjectId(id)).toArray((err, result) => {
      if(err) return res.send(err)
      res.render('edit.ejs', { mongodbrdn: result})
    })
  })
  .post((req, res) => {
    var id = req.params.id
    var name = req.body.name
    var surname = req.body.surname

    db.collection('mongodbrdn').updateOne({_id: ObjectId(id)}, {
      $set: {
        name: name,
        surname: surname
      }
    }, (err, result) => {
        if (err) return res.send(err)
        res.redirect('/show')
        console.log('Atualizado no Bando de Dados')
      })
    })
  


