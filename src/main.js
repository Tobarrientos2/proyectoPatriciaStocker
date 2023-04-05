const express = require('express');
const app = express();
const port = 2000;
const ejs = require('ejs'); 
const path = require('path'); 
const { registrarse } = require('./Controlador/usuarioControlador.js');


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Vista'));


app.get('/', (req, res) =>{
  res.render("formulario/formulario_registro.ejs"); 
}); 

app.post('/', async (req, res) => {
  const datosRegistro = {
    nombreUsuario: req.body.nombreUsuario,
    correoElectronico: req.body.correoElectronico,
    contraseña: req.body.contraseña
  };

  const resultadoRegistro = await registrarse(datosRegistro);
  if (resultadoRegistro) {
    res.render("formulario/registro_exitoso.ejs");
  } else {
    res.render("formulario/formulario_registro.ejs", { error: "Error al registrar el usuario" });
  }
});


app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`)
});
