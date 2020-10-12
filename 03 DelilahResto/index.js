const sequelizer = require("sequelize");
const express = require("express");
const server = new express();
const bodyParser = require("body-parser");

const conexion = new sequelizer('delilah', 'root', 'acamicaDWFS24', {
  host: 'localhost',
  dialect: 'mysql'
});

conexion
  .authenticate()
  .then(() => {
    console.log('mySQL conexion realizada en puerto 3306');
  })
  .catch(err => {
    console.error('Error de conexión a DB:', err.original.sqlMessage);
  });


server.listen(3000, ()=>{
    console.log("Servidor activo en puerto 3000");
});

server.use(bodyParser.json());

//RUTAS
server.get("/cuentas", (req,res)=>{
  res.json(cuentas);
});