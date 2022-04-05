const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async(req, res = response ) => { 

    const { email, password } = req.body;

    try {

        let usuario = await Usuario.findOne({ email });
        console.log(usuario);

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe'
            });
        }

        usuario = new Usuario( req.body );
    
        

        //Encriptar contraseña

        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        //Generar token
        const token = await generarJWT(usuario._id, usuario.name);
    
        res.status(201).json({
            ok: true,
            uid: usuario._id,
            name: usuario.name,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador',
        })
    }
}

const loginUser = async(req, res = response ) => { 

    const { email, password } = req.body;

    try {
            
            let usuario = await Usuario.findOne({ email });
            console.log(usuario);
    
            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El usuario no existe'
                });
            }
    
            const validPassword = bcrypt.compareSync(password, usuario.password);
    
            if (!validPassword) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Contraseña incorrecta'
                });
            }
    
            const token = await generarJWT(usuario._id, usuario.name);
    
            res.json({
                ok: true,
                uid: usuario._id,
                name: usuario.name,
                token
            });
    
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador',
        })
        
    }
}

const revalidarToken = async(req, res = response ) => { 

    const { uid, name } = req;

    const token = await generarJWT(uid, name);

    
    res.json({
        ok: true,
        token
    });
}

module.exports = {
    crearUsuario,
    loginUser,
    revalidarToken

}