import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Navigation from './components/Navegacion';
import {datos} from "./datos.json";
import PersojaneForm from './components/PersonajeForm';

const express = require('express');
const api = express();
var mongo = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://localhost:27017/Personajes';

api.get('/api/v1/temas',(req, res) =>{

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

api.post('/api/v1/temas',(req,res) =>{
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

api.put('/api/v1/temas/:id',(req,res)=>{
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

api.delete('/api/v1/temas/:id',(req,res)=>{
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

api.get('/api/v1/temas/:id',(req, res) =>{
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
api.listen(port, () =>console.log(`Listening on port ${port}...`));



class App extends Component {
  constructor (){
    super();
    this.state = {
      datos
    }
    this.handleAddPersonaje = this.handleAddPersonaje.bind(this);
  }
 

  
    removePersonaje(index) {
      this.setState({
        datos: this.state.datos.filter((e, i) => {
          return i !== index
        })
      });
    }
  
    handleAddPersonaje(personaje) {
      this.setState({
        datos: [...this.state.datos, personaje]
      })
    }

  render() {
    const personajes = this.state.datos.map ((personaje, i) => {
      return(
        <div className="col-md-4">
          <div className="card mt-4">
            <div className="card-header">
             <h3>{personaje.nombre}</h3>
             <spam className="badge badge-pill badge-danger ml-2">
              {personaje.clase}
             </spam>
             <spam className="badge badge-pill badge-danger ml-2">
              {personaje.raza}
             </spam>
            </div>            
            <div className = "card-body">
            <img src={personaje.icono}/>
            <spam className="badge badge-pill badge-danger ml-2">
              {personaje.dificutad}
             </spam>
            <div className="card-footer">
            
              <button
                className="btn btn-danger"
                onClick={this.removePersonaje.bind(this, i)}>
                Delete
              </button>
            </div>
            </div>
          </div>
        </div>
      )
    });

    return (
      <div className="App">

      <nav className="navbar navbar-dark bg-dark">
          <a className="navbar-brand" href="/">
            Personajes
            <span className="badge badge-pill badge-light ml-2">
              {this.state.datos.length}
            </span>
          </a>
        </nav>

        <div className="container"> 
          <div className="row mt-4">

            <div className="col-md-4 text-center">
              <img src={logo} className="App-logo" alt="logo" />
            <PersojaneForm onAddPersonaje={this.handleAddPersonaje}></PersojaneForm>
            </div>

            <div className="col-md-8">
              <div className="row">
              {personajes}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
