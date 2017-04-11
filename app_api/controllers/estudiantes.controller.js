const EstudianteModel = require('../models/estudiante.model');
const ParaleloModel = require('../models/paralelo.model');
const LeccionModel = require('../models/leccion.model');

var respuesta = require('../utils/responses');
/*
* Estudiante metodos basicos
*/
const obtenerTodosEstudiantes = (req, res) => {
  EstudianteModel.obtenerTodosEstudiantes((err, estudiantes) => {
    if (err) return respuesta.serverError(res);
    return respuesta.ok(res, estudiantes);
  })
}

const crearEstudiante = (req, res) => {
  let estudiante = new EstudianteModel({
    nombres: req.body.nombres,
    apellidos: req.body.apellidos,
    correo: req.body.correo,
    matricula: req.body.matricula
  })
  estudiante.crearEstudiante((err) => {
    if (err) return respuesta.serverError(res);
    return respuesta.creado(res, estudiante);
  })
}

const obtenerEstudiante = (req, res) => {
	res.send(`obtenerEstudiante ${req.params.id_estudiante}`);
}

// mensajes error dos: si no es del curso, o si ingreso mal la contrasena leccion
// restrigir acceso al lecciones si no ha ingresado el codigo
const verificarEstudiantePuedeDarLeccion = (req, res) => {
  const { _id } = req.session
  const { codigo_leccion } = req.params
  ParaleloModel.obtenerParaleloDeEstudiante(_id, (err, paralelo) => {
    if (err) {
      return respuesta.serverError(res)
    }else if (paralelo.dandoLeccion) {
      LeccionModel.obtenerLeccionPorCodigo(codigo_leccion, (err, leccion) => {
        console.log(leccion)
        if (err) return respuesta.serverError(res);
        if (!leccion) return respuesta.noOK(res);
        req.app.set('habilitado_para_leccion', true)
        return respuesta.okAnadido(res);
        // TODO: setearle al estudiante la leccion y que la esta dando
      })
    } else {
      return respuesta.noOK(res); // DOCUMENTACION
    }
  })
}

module.exports = {
	obtenerTodosEstudiantes,
	crearEstudiante,
	obtenerEstudiante,
  // leccion
  verificarEstudiantePuedeDarLeccion,
}
