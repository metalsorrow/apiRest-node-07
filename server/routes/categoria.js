const express = require('express');

const _ = require('underscore')

const Categoria = require('../models/categoria')

const { verifcaAdminRol, verificaToken } = require('../middlewares/autenticacion')

const app = express();

//====================================
//  Traer todas las categorias
//====================================
app.get('/categoria', [verificaToken], (req, res) => {
    Categoria.find()
        .sort('nombre')
        .populate('usuario', 'nombre email')
        //Devuelve una accion al realizar la peticion http
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Categoria.countDocuments({}, (err, conteo) => {
                return res.json({
                    ok: true,
                    categorias,
                    conteo
                })
            })
        });
});

//====================================
//  Categorias segun ID
//====================================
app.get('/categoria/:id', [verificaToken], (req, res) => {
    let categoriaId = req.params.id;

    Categoria.findById(categoriaId, (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (_.isEmpty(categoria)) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            })
        }

        return res.json({
            ok: 200,
            categoria
        })
    })
});

//====================================
//  Crear nueva Categoria
//====================================
app.post('/categoria', [verificaToken], (req, res) => {
    let body = req.body

    let categoria = new Categoria({
        nombre: body.nombre,
        usuario: req.usuario._id //sacar el usuario desde el token, especificamente el metodo verificaToken
    })

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoriaDB
        });
    });
});

//====================================
//  Actualizar categoria
//====================================
app.put('/categoria/:id', [verificaToken], (req, res) => {
    let categoriaId = req.params.id;
    let body = _.pick(req.body, 'nombre') //datos a actualizar

    Categoria.findByIdAndUpdate(categoriaId, body, { new: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: 200,
            categoriaDB
        });
    })
});

//====================================
//  Actualizar categoria
//====================================
app.delete('/categoria/:id', [verificaToken, verifcaAdminRol], (req, res) => {
    let categoriaId = req.params.id;

    Categoria.findByIdAndRemove(categoriaId, (err, categoriaEliminada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            categoriaEliminada
        });

    });
});



module.exports = app