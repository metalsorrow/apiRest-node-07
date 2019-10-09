const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto')
const path = require('path');
const fs = require('fs');


// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req,res)=>{


    let tipo = req.params.tipo;
    let id = req.params.id;

 
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok:false,
            err:{
                message:'No files were uploaded.'
            }
        });
    }


    let tiposValidos= ['productos','usuarios']
    
    if(tiposValidos.indexOf(tipo)<0){
        return res.status(400).json({
            ok:false,
            err:{
                message:'Los tipos permitidos son: '+tiposValidos,
                tipo
            }
        });    
    }


    let archivo = req.files.archivo;

    let nombreCortado = archivo.name.split('.')
    let extensionesPermitidas = ['jpg','png']

    let extension = nombreCortado[nombreCortado.length - 1];

    if(extensionesPermitidas.indexOf(extension)){
        return res.status(400).json({
                ok:false,
                err:{
                    message:'La extension del archivo no es permitida',
                    ext: extension
                }
        })
    }



    //Cambiar nombre del archivo
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension}`
    
    archivo.mv(`uploads/${ tipo }/${nombreArchivo}`, (err) => {
        if (err){
                return res.status(500).json({
                ok: false,
                err
            });
        }

        switch (tipo) {
            case 'productos':
                imagenProducto(id,res,nombreArchivo);
                break;
            case 'usuarios':
                imagenUsuario(id,res,nombreArchivo);
                break;
            default:
                break;
        }
        
    });
});


//Agrega a el usuario el path de la imagen agregada
function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err,usuarioDB)=>{
        if(err){
            borrarArchivo(nombreArchivo,'usuarios')

            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!usuarioDB){
            borrarArchivo(nombreArchivo,'usuarios')

            return res.status(400).json({
                ok:false,
                err:{
                    message:'Usuario no existe segun el id'
                }
            })
        }


        borrarArchivo(usuarioDB.img,'usuarios')


        usuarioDB.img = nombreArchivo;

        Usuario.findOneAndUpdate(usuarioDB.id, usuarioDB, {new: true}, (err,usuarioGuardado) =>{

            // usuarioDB.save( (err,usuarioGuardado) => {
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                });
            }
            
            res.json({
                ok: true,
                usuario : usuarioGuardado
            });
        });
    });
} ; 



function imagenProducto(id,res, nombreArchivo) {

    Producto.findById(id, (err,productoDB)=>{
        if(err){
            borrarArchivo(nombreArchivo,'productos')

            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!productoDB){
            borrarArchivo(nombreArchivo,'productos')

            return res.status(400).json({
                ok:false,
                err:{
                    message:'Producto no existe segun el id'
                }
            })
        }


        // borrarArchivo(productoDB.img,'productos')

        
        productoDB.img = nombreArchivo;
        //*********************No me deja agregar el campo img */

        Producto.findByIdAndUpdate(productoDB.id, productoDB, (err,productoGuardado) =>{
        // productoDB.save((err,productoGuardado) =>{

            // usuarioDB.save( (err,usuarioGuardado) => {
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                });
            }
            
            res.json({
                ok: true,
                usuario : productoGuardado
            });
        });
    });
} 


function borrarArchivo(nombreImg, tipo){
    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImg }`)

    if( fs.existsSync(pathImagen) ){
        fs.unlinkSync(pathImagen) //permite borrar
    }
}

module.exports = app;