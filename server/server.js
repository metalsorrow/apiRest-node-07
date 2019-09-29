const express = require('express')
const app = express()
const bodyParser = require('body-parser')
require('./config/config')


//MIDDLEWARES//
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())







//obtiene datos
app.get('/usuario', function (req, res) {
  res.json('get usuario')
})
//guardar datos
app.post('/usuario', function (req, res) {
    
    let body = req.body;

    if(body.nombre == undefined){
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });
    }else{
        res.json({
            persona: body
        });
    }

    res.json({body})
  }) 

//actualizar
app.put('/usuario/:id', function (req, res) {
  
  let id = req.params.id;

    res.json({
        id
    })
})
//delete, ahora se acostumbra a cambiar los estados en vez de borrarlo
app.delete('/usuario', function (req, res) {
    res.json('delete usuario')
})


app.listen(process.env.PORT,()=>{
    console.log(`escuchando puerto ${process.env.PORT}`);
})