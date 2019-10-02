//====================================
//          PUERTO
//====================================
process.env.PORT = process.env.PORT || 3000;


//====================================
//          ENTORNO
//====================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; 


//====================================
//          Vencimiento del Token
//====================================
//60 Segundos
//60 Minutos
//24 Horas
//30 Dias
process.env.CADUCIDAD_TOKEN = 60*60*24*30;


//====================================
//          SEED deautentificacion
//====================================
process.env.SEED = process.env.SEED || 'seed-desarrollo';




//====================================
//          BASE DE DATOS
//====================================
let urlDB;

if ( process.env.NODE_ENV === 'dev' ){
    urlDB= 'mongodb://localhost:27017/cafe'
}else{
    urlDB = process.env.MONGO_URL
}
process.env.URLDB = urlDB