const {
    validar_datos_registro,
    comprobar_disponibilidad_registro,
    cifrar_y_almacenar_datos_registro
  } = require("../Modelo/usuario.js");

//Registrar usuario
async function registrarse(){
console.log("Iniciando proceso de registro");
//Obtener Datos Registro
const datosRegistro = await obtenerDatosRegistro(); 
console.log("Datos de registro obtenidos:", datosRegistro);
 // Validar los datos de registro

 const validacion = validar_datos_registro(datos_registro); 
 console.log("Resultado de la validación:", validacion);
if(validacion !== true){
    console.log(validacion); 
    return false
}  

// Comprobar la disponibilidad de nombre de usuario y correo electrónico

const disponibilidad = await comprobar_disponibilidad_registro(datosRegistro); 
console.log("Resultado de la comprobación de disponibilidad:", disponibilidad);
if(disponibilidad !== true){
    console.log(disponibilidad); 
        return false; 
} 
  // Cifrar y almacenar los datos de registro
const almacenamiento = await cifrar_y_almacenar_datos_registro(datosRegistro); 
console.log("Resultado del almacenamiento:", almacenamiento);

if(almacenamiento !== "Usuario registrado con éxito"){
console.log(almacenamiento); 
return false 
} 
const resultadoEnvio = await enviarCorreoConfirmacionRegistro(datosRegistro); 
console.log("Resultado del envío del correo de confirmación:", resultadoEnvio);
if(!resultadoEnvio){
        console.log("Error al enviar el correro de confirmación"); 
    }  
    return resultadoEnvio; 
} 





    //Subfuncion 1
    async function obtenerDatosRegistro(){
        console.log("Obteniendo datos de registro");
    //Entrada: Ninguna 
    //Procesamiento: Procesamiento:
    //|   |   |   |-- solicitar nombre de usuario, correo electrónico y contraseña al usuario
    const nombreUsuario = await solicitarInput("Introduce tu nombre de usuario: "); 
    const correoElectronico = await solicitarInput("Introduce tu correo electrónico: "); 
    const contraseña = await solicitarInput("Introduce tu contraseña: "); 

    //|   |   |   |-- crear diccionario con datos de registro: {nombreUsuario, correoElectronico, contraseña}
    const datosRegistro = {nombreUsuario, correoElectronico, contraseña};
    console.log("Datos de registro creados:", datosRegistro);

    //Salida: diccionario con datos de registro

    return datosRegistro; 
    } 

    async function solicitarInput(mensaje){
        return new Promise(resolve => { 
            const readLine = require("readline").createInterface({
                input: process.stdin, 
                output: process.stdout
            });
            readLine.question(mensaje, respuesta =>{
                readLine.close(); 
                resolve(respuesta); 
            });
        }); 
    }

    //Subfuncion 2
    //Entrada: Diccionario con datos de registro
    async function enviarCorreoConfirmaciónRegistro(datosRegistro){
        console.log("Enviando correo de confirmación");
        const {nombreUsuario, correoElectronico} = datosRegistro; 
    //Procesamiento: 
    //  |   |   |-- crearMensajeCorreo(datos_registro)
    const mensajeCorreo = crearMensajeCorreo(datosRegistro); 
    //  |   |   |-- enviarCorreo(destinatario, mensajeCorreo)
    const resultadoEnvio = enviarCorreo(correoElectronico, mensajeCorreo); 
        return resultadoEnvio; 
    } 

    function crearMensajeCorreo(datosRegistro){
        console.log("Mensaje de correo creado:", mensajeCorreo);
        //Entrada:{nombreUsuario, correoElectronico}
        const {nombreUsuario} = datosRegistro; 
        
        //Procesamiento:
        const mensaje = `Hola, ${nombreUsuario}, \n
        Gracias por registrarte en nuestro sitio web. \n
        Esperemos que disfrutes de nuestros servicios. \n 
        Saludos, \n 
        Equipo de Patricia Stocker`

        //Salida: 
        return mensaje; 
    } 

    const nodemailer = require('nodemailer');

    async function enviarCorreo(destinatario, mensajeCorreo){
        console.log("Resultado del envío del correo:", resultadoEnvio);
         // Entrada: destinatario y mensaje de correo
    //Crear una instancia de nodeMailer 
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', 
        port: 587, 
        secure: false, 
        auth: {
            user: 'info@patriciastocker.com', 
            pass: 'brillante123'
        } 
    });

    //Configurar el correo electrónico a enviar 
    let mailOptions = {
        from: 'info@patriciastocker.com', 
        to: destinatario, 
        subject: 'Bienvenido a Patricia Stocker', 
        text: mensajeCorreo
    };
    //Enviar al correo 
    let info = await transporter.sendMail(mailOptions); 

    // Si el correo se envía correctamente, devolver true
    if(info.messageId){
        return true; 
    } else{
        return false; 
    }
}  



module.exports = {
    registrarse
  };
  