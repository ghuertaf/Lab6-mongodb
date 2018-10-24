import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Navigation from './components/Navegacion';
import {datos} from "./datos.json";
import PersojaneForm from './components/PersonajeForm';


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
