const express = require('express'); //Uso de express, encargado del enrutamiento y peticiones de forma rapida

const bcrypt = require('bcrypt'); //Encriptacion de contraseñas

const jwt = require('jsonwebtoken');

const _ = require('underscore'); //Funcionalidades extras de JS

const Usuario = require('../models/usuario'); //Modulo creado de usuario

const app = express(); // usar express



app.post('/login', (req,res)=>{
    
    let body = req.body;
    Usuario.findOne({email: body.email}, (err, usuarioDB) =>{

        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                err:{
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }
    

        //No es equivalente a un if, ya que este compara un valor normal con uno encriptado, el metodo los verifica
        if( !bcrypt.compareSync( body.password, usuarioDB.password )){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Usuario o (contraseña) incorrectos',
                }
            });
        }

        let token =jwt.sign({
            usuario: usuarioDB
        },process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN});

        res.json({
            ok:200,
            usuario: usuarioDB,
            token
        });
    
    })

    
})



module.exports = app;