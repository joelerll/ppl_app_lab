var app = new Vue({
	mounted: function(){
		$('.button-collapse').sideNav();
		$(".dropdown-button").dropdown({ hover: false });
		$('.scrollspy').scrollSpy();
		$('#modalEliminarPregunta').modal();
		$('#modalNuevoCapitulo').modal();
		//this.getPreguntas();
		this.obtenerLogeado();
		this.obtenerCapitulos();

	},

	el: '#preguntas',
	data: {
		preguntas: [],
		preguntasEstimacion: [],
		capitulosObtenidos: [],
		capitulos: [],
		profesor: {},
		capitulo: {
			nombre: '',
			tipo: 'estimacion'
		}
	},
	methods: {
		obtenerLogeado: function() {
      var self = this;
      this.$http.get('/api/session/usuario_conectado').
        then(res => {
          if (res.body.estado) {
          	self.profesor = res.body.datos;
          }
        });
    },
    obtenerCapitulos: function(){
    	var self = this;
    	var url = '/api/capitulos/'
    	self.$http.get(url).then(response => {
    		//SUCCESS CALLBACK
    		self.capitulosObtenidos = response.body.datos;
    		$.each(self.capitulosObtenidos, function(index, capitulo){
    			if(capitulo.tipo.toLowerCase()=='estimacion'){
    				self.capitulos.push(capitulo);
    			}
    		});
    		self.obtenerPreguntas();
    	}, response => {
    		//ERROR CALLBACK
    		console.log('Hubo un error al obtener los capítulos de la base de datos.');
    		console.log(response);
    	})
    },
    obtenerPreguntas: function(){
    	var self = this;
    	var url = '/api/preguntas/';
    	self.$http.get(url).then(response => {
    		//SUCCESS CALLBACK
    		self.preguntas = response.body.datos;
    		//Selecciono solo las que son de estimacion
    		$.each(self.preguntas, function(index, pregunta){
    			if(pregunta.tipoLeccion.toLowerCase()=='estimacion'){
    				self.preguntasEstimacion.push(pregunta);
    			}
    		});
    		self.dividirPreguntasEnCapitulos();
    	}, response => {
    		//ERROR CALLBACK
    		console.log('Hubo un error al obtener las preguntas de la base de datos');
    	});
    },
    dividirPreguntasEnCapitulos: function(){
    	var self = this;
    	$.each(self.preguntasEstimacion, function(index, pregunta){
    		$.each(self.capitulos, function(j, capitulo){
    			if(pregunta.capitulo.toLowerCase()==capitulo.nombre.toLowerCase()){
    				capitulo.preguntas.push(pregunta);
    				return false;
    			}
    		});
    	});
    },
    crearCapitulo: function(){
    	var self = this;
    	var url = '/api/capitulos/'
    	self.$http.post(url, self.capitulo).then(response => {
    		self.capitulos.push(self.capitulo);
    		self.capitulo.nombre = '';
    	}, response => {
    		console.log('Hubo un error al crear el capítulo.')
    		console.log(response);
    	})
    },

		nuevaPregunta: function(){

			window.location.href = '/profesores/preguntas/nueva-pregunta'

		},
		eliminarPregunta: function(id){
			var self = this;
			var url = '/api/preguntas/' + id;
			this.$http.delete(url).then(response => {
				//ELIMINAR LA PREGUNTA DE SELF.CAPITULOS
				self.capitulos = [];
				self.preguntas = []	;
				this.getPreguntas();			
			}, response => {
				//error callback
				console.log(response)
			});
			
		},
		crearModalEliminarPregunta: function(id){
			var self = this;
			var preguntaId = id;
			//Primero hay que eliminar el modal-content. Sino cada vez que abran el modal se añadirá un p más
			$('#modalEliminarPreguntaContent').empty();
			//Ahora si añadir las cosas
			var modalContentH4 = $('<h4/>').addClass('center-align').text('Eliminar');
			var modalContentP = $('<p/>').text('Seguro que desea eliminar la pregunta: ' + preguntaId)
			modalContentP.addClass('center-align')
			$('#modalEliminarPreguntaContent').append(modalContentH4, modalContentP);
			//Lo mismo con el footer
			$('#modalEliminarPreguntaFooter').empty();
			var btnEliminar = $('<a/>').attr({
				'href': '#!',
				'class': 'modal-action modal-close waves-effect waves-green btn-flat'
			});			
			btnEliminar.text('Eliminar');
			btnEliminar.click(function(){
				self.eliminarPregunta(preguntaId);

			})
			var btnCancelar = $('<a/>').attr({
				'href': '#!',
				'class': 'modal-action modal-close waves-effect waves-green btn-flat'
			});
			btnCancelar.text('Cancelar');
			$('#modalEliminarPreguntaFooter').append(btnEliminar, btnCancelar)
			$('#modalEliminarPregunta').modal('open');
		},
		
		prueba: function(){
			var self = this;
			console.log(self.capitulos)
			console.log(self.preguntas)
		},
		checkCreador: function(pregunta){
			var self = this;
			if(pregunta.creador==self.profesor._id) return true;
			return false
		},
		
    

	}
});

$('body').on("click", '#btnCapituloNuevo', function(){
	$('#modalNuevoCapitulo').modal('open');
})

document.addEventListener("DOMContentLoaded", function(event) {
  $.get({
    url: "/../navbar/profesores",
    success: function(data) {
      document.getElementById('#navbar').innerHTML = data;
      $(".button-collapse").sideNav();
      $(".dropdown-button").dropdown();
    }
  })
});
