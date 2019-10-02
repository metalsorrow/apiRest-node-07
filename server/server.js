const express = require('express')
const bodyParser = require('body-parser') //ayuda a obtener los datos desde el get
const mongoose = require('mongoose') //ayuda para realizar las peticiones a la base de datos
const app = express()
require('./config/config') //trae las configuracion establecidas por nosotros en la carpeta config


//MIDDLEWARES//
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


//configuracion de rutas
app.use( require('./routes/index' ));









const Instancia = async () =>{
    await   mongoose.connect(process.env.URLDB,
                            { useNewUrlParser: true, useCreateIndex:true, useUnifiedTopology: true },
                            (err,res)=>{
                if (err) throw err;
            
                console.log('Base de datos ONLINE');
            
            });
            
    await   app.listen(process.env.PORT,()=>{
                console.log(`escuchando puerto local: ${process.env.PORT}`);
            })
}



Instancia()
    .then(res=>{
        res
    })
    .catch(err =>{
        err
    })