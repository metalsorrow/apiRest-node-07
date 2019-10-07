const express = require('express')

const Producto = require('../models/producto') //al traer productos, por defecto trae el mongoose, ya que es un eschema dentro de sus librerias que se exporta

const _ = require('underscore')

const { verifcaAdminRol, verificaToken } = require('../middlewares/autenticacion')

const app = express()



//================================
//  Buscar producto
//================================
app.get('/productos/buscar/:termino', verificaToken ,(req,res)=>{
    
    let termino = req.params.termino;

    let regx = new RegExp(termino,'i'); //expresion regular

    Producto.find({ nombre : regx}) // aqui se ingresan los parametros de la busqueda
            .populate('categoria','nombre')
            .exec((err, productos)=>{
                if(err){
                    return res.status(500).json({
                        ok:false,
                        err
                    })
                }
                
                return res.status(200).json({
                    ok: true,
                    productos
                })
            })
})



//================================
//  Obtener Productos
//================================
app.get('/productos',verificaToken,(req, res)=>{

    let desde = req.query.desde || 0;
    desde = Number(desde)

    Producto.find({disponible: true})
            .sort('nombre')
            .skip(desde)
            .populate('usuario','nombre email')
            .populate('categoria', 'descripcion')
            .exec((err,productosDB)=>{
                if(err){
                    return res.status(500).json({
                        ok:false,
                        err
                    })
                }

                return res.json({
                    ok: true,
                    productosDB
                })
            })
    //cargar usuario y categoria segun el id, Populate
    //Paginado, Ordenado
})

//================================
//  Obtener un producto por Id
//================================
app.get('/productos/:id',verificaToken, (req,res)=>{
    let id = req.params.id

    Producto.findById(id)
            .sort('nombre')
            .populate('usuario','nombre email')
            .populate('categoria', 'descripcion')
            .exec((err, productoDB)=>{
                if(err){
                    return res.status(500).json({
                        ok:false,
                        err
                    })
                }

                if(!productoDB){
                    return res.status(400).json({
                        ok:false,
                        err:{
                            message:'No existe el id de este Producto'
                        }
                    })
                }

                return res.status(200).json({
                    ok: true,
                    producto: productoDB
                })

            })
})


//================================
//  Crear un producto
//================================
app.post('/productos',verificaToken, (req,res)=>{
    //grabar al usuario y la categoria
    let usuarioId = req.usuario._id
    let body = req.body

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: usuarioId
    })


    producto.save((err, productoDB)=>{
        if(err){
            return res.status(500).json({ //algo salio mal en el backend
                ok:false,
                err
            })
        }

        return res.status(201).json({
            ok: true,
            producto: productoDB
        })
    });
})


//================================
//  actualizar un producto por Id
//================================
app.put('/productos/:id',verificaToken, (req,res)=>{
    //cargar usuario y categoria segun el id, Populate
    let body = req.body;
    let productoId = req.params.id;


    Producto.findById(productoId,{new: true}, (err,productoDB) => {
        if(err){
            return res.status(500).json({ //algo salio mal en el backend
                ok:false,
                err
            })
        }

        if(!productoDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'El Id no existe'
                }
            })
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.disponible = body.disponible;
        productoDB.categoria = body.categoria;

        productoDB.save((err, productoGuardado) =>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }


            return res.status(201).json({
                ok: true,
                producto: productoGuardado
            })
        })

    })

})


//================================
//  Borrar un producto por Id
//================================
app.delete('/productos/:id',verificaToken, (req,res)=>{
    let id = req.params.id
    let body = req.body

    Producto.findById(id,(err,productoDB)=>{
        if(err){
            return res.status(500).json({
                or:false,
                err
            });
        }

        if(!productoDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'No existe un producto con esta ID'
                }
            });
        }

        productoDB.disponible = false;

        productoDB.save({new: true},(err, productoBorrado)=>{
            if(err){
                return res.status(500).json({
                    or:false,
                    err
                });
            }


            return res.status(200).json({
                ok:true,
                productoBorrado,
                message:'Producto borrado'
            })
        })

    });
})


module.exports = app