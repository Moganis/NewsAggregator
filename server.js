const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api-routes');
require('dotenv/config');

const app = express();
const db = mongoose.connection;
app.use(bodyParser.json());
app.use('/api/heroes', apiRoutes); 

// app.get('/api/heroes', (req, res) => {
//     const heroes = [
//         {id: '1', name: 'Juggernaut', type: 'Agility'},
//         {id: '2', name: 'Bristleback', type: 'Strength'},
//         {id: '3', name: 'Juggernaut', type: 'Intelligence'}
//     ];

//     res.json(heroes);
// });

const port = 5000;

mongoose.connect(process.env.DB_CONNECTION,{useNewUrlParser: true, useUnifiedTopology: true },() => {
    console.log("CONNECTED TO DB");
});

app.get('/', function(req, res) {
    res.send("Welcome!");
})

app.get('*', function(req, res) {
    res.send("404 Not Found!");
})

app.listen(port, () => {
    try {
        console.log("200 OK");
    } catch (err) {
        res.json({message:err});
    }
});