const mongoose = require('mongoose');
//Schema y Modelo de Mongoose
    const usuarioSchema = new mongoose.Schema({
        nombreUsuario: {
            type: String, 
            require: true, 
            unique: true
        }, 
        correoElectronico: {
            type: String, 
            require: true, 
            unique: true
        }, 
        contraseña:{
            type: String, 
            require: true, 
            unique: true
        }
    });


function validar_datos_registro(datos_registro) {
    //Entrada: {nombreUsuario, correoElectronico, contraseña}
    const { nombreUsuario, correoElectronico, contraseña } = datos_registro;
    
    //Procesamiento:
//   |   |   |-- verificarLongitud(valor, min, max)
//   |   |   |-- verificarFormatoCorreo(correoElectronico)
//   |   |   |-- verificarCaracteresPermitidos(valor)
//   |   |   |-- verificarLongitudContraseña(contraseña)
//   |   |   |-- verificarCombinacionLetrasNumeros(contraseña)
   

    if (!verificarLongitud(nombreUsuario, 3, 15)) {
      return "El nombre de usuario debe tener entre 3 y 15 caracteres.";
    }
    
    if (!verificarFormatoCorreo(correoElectronico)) {
      return "El formato del correo electrónico es inválido.";
    }
    
    if (!verificarCaracteresPermitidos(nombreUsuario) || !verificarCaracteresPermitidos(contraseña)) {
      return "El nombre de usuario y la contraseña solo deben contener caracteres alfanuméricos.";
    }
    
    if (!verificarLongitudContraseña(contraseña)) {
      return "La contraseña debe tener al menos 8 caracteres.";
    }
    
    if (!verificarCombinacionLetrasNumeros(contraseña)) {
      return "La contraseña debe contener al menos una letra y un número.";
    }

// |   |   |-- Salida: mensaje de error o "True"

    return true;
  }

  //Desarrollo Lógico 
function verificarLongitud(valor, min, max){
   return valor.length >= min && valor.length <= max; 
} 

function verificarFormatoCorreo(correoElectronico){
    const expresionRegular = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return expresionRegular.test(correoElectronico); 
} 

function verificarCaracteresPermitidos(valor){
    const expresionRegular = /^[a-zA-Z0-9]+$/; 
    return expresionRegular.test(valor); 
}

function verificarLongitudContraseña(contraseña){
    return contraseña.length >= 8; 
} 

function verificarCombinacionLetrasNumeros(contraseña){
    const expresionRegular = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return expresionRegular.test(contraseña); 
} 



async function comprobar_disponibilidad_registro(datos_registro){
// |-- Entrada: {nombreUsuario, correoElectronico}
const {nombreUsuario, correoElectronico} = datos_registro; 
//|   |   |-- Procesamiento:
//|   |   |   |-- nombreUsuarioDisponible(nombreUsuario)
//|   |   |   |-- correoElectronicoDisponible(correoElectronico)

const nombreUsuarioDisponibleResultado = await nombreUsuarioDisponible(nombreUsuario); 
if(!nombreUsuarioDisponibleResultado){
    return "El nombre de usuario ya está en uso."; 
} 
const correoElectronicoDisponibleResultado = await correoElectronicoDisponible(correoElectronico); 
if(!correoElectronicoDisponibleResultado(correoElectronico)){
    return "El correo electrónico ya está en uso";
    } 
//|   |   |-- Salida: mensaje de error o "True"
return true; 
} 

//Desarrollo Lógico 

async function nombreUsuarioDisponible(nombreUsuario){ //Entrada
    const usuarioExistente = await Usuario.findOne({ nombreUsuario }); //Procesamiento
    return !usuarioExistente; //Salida
} 

async function correoElectronicoDisponible(correoElectronico) {  //Entrada
    const usuarioExistente = await Usuario.findOne({ correoElectronico }); //Procesamiento
    return !usuarioExistente;  //Salida
  }


async function cifrar_y_almacenar_datos_registro(datos_registro){
    //Entrada: {nombreUsuario, correoElectronico, contraseña}
    const {nombreUsuario, correoElectronico, contraseña} = datos_registro; 
    
    //Procesamiento: 

    //|-- cifrarContraseña(contraseña)
    //|-- almacenarUsuarioEnBaseDeDatos(datosCifrados)
    const hash = await cifrarContraseña(contraseña); 
    if(!hash){
        return "Error al cifrar la contraseña"; 
    } 
    const almacenarUsuarioResultado = await almacenarUsuarioEnBaseDeDatos(nombreUsuario, correoElectronico, hash);
    if(!almacenarUsuarioResultado){
        return "Error al almacenar los datos del usuario"; 
    } 
    //|-- Salida: confirmación
    return "Usuario registrado con éxito"; 
  }   


const bcrypt = require("bcrypt"); 

//Desarrollo Lógico 
async function cifrarContraseña(contraseña){ //Entrada
    const saltRounds = 10; //Entrada
    try{
    const hash = await bcrypt.hash(contraseña, saltRounds); //Procesamiento
    return hash; //Salida
    } catch(error){
        return null; 
    }  
} 

async function almacenarUsuarioEnBaseDeDatos(nombreUsuario, correoElectronico, hash){ //Entrada
    const datosCifrados = new Usuario({ nombreUsuario, correoElectronico, contraseña:hash}); //Procesamiento
    try{
        await datosCifrados.save(); 
        return true; 
    } catch(error){
        return false;
    } 
} 




module.exports = {
    validar_datos_registro,
    comprobar_disponibilidad_registro,
    cifrar_y_almacenar_datos_registro,
  };
  