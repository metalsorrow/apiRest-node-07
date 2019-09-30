const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
require('./config/config')


//MIDDLEWARES//
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use( require('./routes/usuario' ));










mongoose.connect(process.env.URLDB,
                { useNewUrlParser: true, useCreateIndex:true, useUnifiedTopology: true },
                (err,res)=>{
    if (err) throw err;

    console.log('Base de datos ONLINE');

});

app.listen(process.env.PORT,()=>{
    console.log(`escuchando puerto local: ${process.env.PORT}`);
})