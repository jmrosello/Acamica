var faker = require('faker');
var moment = require('moment');
var express = require('express');
var app = express();

// Nuestro array con multiples fotos
const pacientes = [
    {
      id: 1,
      nombre: 'John Smith',
      birthdate: '23/07/2000',
      diseases: ['diabetes', 'hipertension', 'covid']
    },
    {
      id: 2,
      nombre: 'Mary Johnson',
      birthdate: '03/08/1954',
      diseases: ['obesity']
    },
    {
      id: 3,
      nombre: 'Harry Gonzalez',
      birthdate: '19/10/1984',
      diseases: ['']
    }
   ]
    
const diseases = ['Malaria', 'Tuberculosis', 'Meningitis', 'Chikungunya', 'Hiv/aids', 'Pneumonia', 'Covid', 'Obesity', 'Diabetes', 'Hipertension']

app.get('/pacientes', (req, res) => {
        res.json(pacientes);
});

// Definicion de la ruta de express que retorna una foto especifica
app.get('/pacientes/:id', (req, res) => {
    const indice = req.params.id;
    res.json(pacientes[indice]);
});

app.post('/pacientes', (req, res) => {
    let paciente = {
        "id": pacientes.length + 1,
        "nombre": faker.name.findName(),
        "birthdate": moment(faker.date.past()).format("DD/MM/YYYY"),
        "diseases": [diseases[Math.floor(Math.random() * (diseases.length - 1)) + 1]]
    };
    pacientes.push(paciente);
    res.status(201);
    res.json(paciente);
});

app.listen(3000, () => {
    console.log('API Test listening on port 3000!');
});
