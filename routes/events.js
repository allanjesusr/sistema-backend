/*
    Events Routes
    /api/events
*/

const { Router } = require('express');
const { check } = require('express-validator')

const { isDate } = require('../helpers/isDate')
const { validarCampos } = require('../middlewares/validar-campos')
const { validarJWT } = require('../middlewares/validar-jwt');
const { getEventos, crearEventos, actualizarEventos, borrarEventos } = require('../controllers/events');

const router = Router();


router.use(validarJWT);


// Obtener eventos
router.get('/', getEventos);

// Crear un nuevo eventos
router.post(
    '/', 
    [
        check('title', 'El título es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
        validarCampos
    ],
    crearEventos);

// Actualizar Eventos
router.put('/:id', actualizarEventos);

// Borrar Evento
router.delete('/:id', borrarEventos);

module.exports = router;
