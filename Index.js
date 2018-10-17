const express = require('express');
const app = express();
var mongo = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://localhost:27017/exampleDb';

app.use(express.json());

const temas = [
    {id: 1, name: 'tema1'}
];

app.get('/', (req, res) =>{
    res.send('Hello World');
});

app.get('/api/v1/temas',(req, res) =>{

    mongo.connect(url, function(err, db){
        var cursor = db.collection('data').find();
        cursor.array.forEach(function(doc, err) {
            assert.equal(null, err);
            temas.push(doc);
        }, function() {
            db.close();
        });
    });

    res.send(temas);
    res.status(200);
});

app.post('/api/v1/temas',(req,res) =>{
    if(!req.body.name){
        // 400 BAD request
        res.status(400).send('Debe el nombre de un ingresar un tema');
        return;
    }

    const tema = {
        id: temas.length + 1,
        name: req.body.name
    };

    mongo.connect(url, function(err, db){
        db.collection('data').insertOne(tema,function(error,result){
            console.log('Se incerto con exito');
            db.close();
        });
    });

    //temas.push(tema);
    res.send(tema);
    res.status(201).send('El tema fue agregado con éxito');
});

app.put('/api/v1/temas/:id',(req,res)=>{
    //Si no exite retorno 404
    mongo.connect(url, function(err, db){
        const tema = db.collection('data').find(c => c.id === parseInt(req.params.id));
        if(!tema) {
            res.status(404).send('El ID del tema no fue encontrado.');
            return;
        }
        //Se hace el update
        tema.name = req.body.name;
        db.send(tema); 
        db.close();
    });
    //Se hace el update
    if(!req.body.name){
        // 400 BAD request
        res.status(400).send('Debe el nombre de un ingresar un tema');
        return;
    }  
    res.status(200);  
});

app.delete('/api/v1/temas/:id',(req,res)=>{
    //Si no exite retorno 404

    mongo.connect(url, function(err, db){
        const tema = db.collection('data').find(c => c.id === parseInt(req.params.id));
        if(!tema) {
            res.status(404).send('El ID del tema no fue encontrado.');
            return;
        }
        //Se hace el update
        const index = db.indexOf(tema);
        db.splice(index,1);
        db.close();
    });

    res.send(tema);    
});

app.get('/api/v1/temas/:id',(req, res) =>{
    const tema = temas.find(c => c.id === parseInt(req.params.id));
    

    mongo.connect(url, function(err, db){
        const tema = db.collection('data').find(c => c.id === parseInt(req.params.id));
        if(!tema) {
            res.status(404).send('El ID del tema no fue encontrado.');
            return;
        }
        db.close();
    });

    res.send(tema);
    res.status(200);
});

// port
const port = process.env.PORT || 3000;
app.listen(port, () =>console.log(`Listening on port ${port}...`));

