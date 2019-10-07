const mongoose = require('mongoose')


let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    nombre:{
        type: String,
        require:[true,'El nombre de la categoria es necesario']
    },
    usuario:{
        type:String
    }
});




module.exports = mongoose.model('Categoria',categoriaSchema);