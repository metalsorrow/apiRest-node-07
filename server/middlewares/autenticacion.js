//===================================
//  Verificar Token
//===================================
const jwt = require('jsonwebtoken');

let verificaToken = ( req,res,next )=>{
    let token = req.get('token'); //nombre del token segun el header

    jwt.verify( token, process.env.SEED, (err, decode) =>{

        if(err){
            return res.status(401).json({
                ok:false,
                err:{
                    message:'Token no valido'
                }
            })
        }

        req.usuario = decode.usuario;
        next();

    });

};


//===================================
//  Verificar Admin Rol
//===================================

let verifcaAdminRol = (req,res,next)=>{
    let usuario = req.usuario;
    let tipoUsuarioValido = 'ADMIN_ROLE'

    if(usuario.role === tipoUsuarioValido){
        return next();
    }
    return res.status(401).json({
        ok:false,
        err:{
            message:'Usuario no es administrador.'
        }
    })

}

module.exports = {
    verificaToken,
    verifcaAdminRol
}