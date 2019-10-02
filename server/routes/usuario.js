const express = require('express'); //Uso de express, encargado del enrutamiento y peticiones de forma rapida

const bcrypt = require('bcrypt'); //Encriptacion de contraseñas
const _ = require('underscore'); //Funcionalidades extras de JS

const Usuario = require('../models/usuario') //Modulo creado de usuario
const {verificaToken,verifcaAdminRol} = require('../middlewares/autenticacion');  //middleware para verificar que exista un token al momento de realizar alguna operacion


const app = express(); // usar express


//obtiene datos
app.get('/usuario', verificaToken , function (req, res) {

    // este es el usuario autentificado
    // return res.json({
    //     usuario: req.usuario,
    //     nombre: req.usuario.nombre,
    //     email: req.usuario.email
    // })


    
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite)
    

    //el corchete interior funciona para filtrar datos, al igual que el del count, estos tienen que usar el mismo filtro para traer el mismo resultado.
    //de la misma forma, el parametro del lado realiza un sistema de filtrado al momento de mandar la respuesta, parecido al anterior,pero de forma local por el lado del servidor
    Usuario.find({ estado:true }, 'nombre email role estado google img')
            .skip(desde)
            .limit(limite)
            .exec( (err, usuarios) =>{
                if(err){
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }

                Usuario.countDocuments({ estado:true},(err,conteo)=>{
                    res.json({
                        ok:true,
                        usuarios,
                        conteo
                    }); 

                })

            });
})

//guardar datos
app.post('/usuario', [verificaToken,verifcaAdminRol] , function (req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        // img : body.img
        role: body.role
    });

    usuario.save( (err,usuarioDB)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok:true,
            usuario: usuarioDB
        })
    });
});

//actualizar
app.put('/usuario/:id', [verificaToken,verifcaAdminRol] , function (req, res) {

    let id = req.params.id;
    let body = _.pick( req.body,['nombre','email','img','role','estado']);



    Usuario.findByIdAndUpdate( id, body ,{new:true, runValidators: true}, (err,usuarioDB) => {
        
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }
        
        
        res.json({
            ok:200,
            usuario: usuarioDB
        })
    });
})

//delete, ahora se acostumbra a cambiar los estados en vez de borrarlo
app.delete('/usuario/:id', [verificaToken,verifcaAdminRol] , function (req, res) {

    let id = req.params.id;
    let body = _.pick(req.body,['estado'])


    Usuario.findByIdAndUpdate(id,body, {new:true}, (err, UsuarioNoActivo)=>{
        
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if( !UsuarioNoActivo){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Usuario ya no se encuentra activo'
                }
            })
        }

        res.json({
            ok:true,
            usuario: UsuarioNoActivo
        })
    })

})

/*
Para eliminar directamente segun el id.
app.delete('/usuario/:id', function (req, res) {

    let id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=>{
        
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if ( !usuarioBorrado ){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok:true,
            usuario: usuarioBorrado
        })
    })

})
*/




module.exports = app;