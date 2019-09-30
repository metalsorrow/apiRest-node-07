const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


let rolesValidos = {
    values:['ADMIN_ROLE','USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}
let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email:{
        type: String,
        required: [true, 'El correo es necesario'],
        unique: true
    },
    password:{
        type: String,
        required: [true, 'El password es necesario']
    },
    img:{
        type:String,
        required: false
    },
    role:{
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado:{
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default: false
    }
});


//eliminar la contraseña dentro del json de retorno del esquema 
usuarioSchema.methods.toJSON = function(){
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

// valida segun el dato unique y concadena un string mas amigable, usa el path para referencia el campo
usuarioSchema.plugin( uniqueValidator, { message: '{PATH} debe de ser unico'} )

module.exports = mongoose.model('Usuario',usuarioSchema)