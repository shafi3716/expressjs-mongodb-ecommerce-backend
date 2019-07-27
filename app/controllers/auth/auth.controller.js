// Auth Model
const Auth = require('../../models/auth/Auth')
const bcrypt = require('bcrypt')
const config = require('../../../config/keys')
const validateRegister = require('../../validation/auth/register')
const validationLogin = require('../../validation/auth/login')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {

    const { name , email , password} = req.body;

    const { errors, inValid } = validateRegister(req.body)

    if (inValid) {
        return res.status(404).json(errors);
      }

    await Auth.findOne({email: email}).then(user => {
        if (user){
            errors.email = 'The email already exists'
            return res.status(409).json(errors);
        }
    })

    // password bcrypt
    const hash_password = bcrypt.hashSync(password, 10);

    const data = new Auth({
        name: name,
        email: email,
        password: hash_password
    })

    await data.save()
        .then( data => {
            res.status(201).json({
                status: 'success',
                message: 'Registration Successfully Completed.',
                data: data,
            })
        })
        .catch( error => res.json({
            message: 'ERROR Occured.',
            error
        }));   
}

const login = async (req, res) => {

    const { email, password } = req.body;

    const { errors, inValid } = validationLogin(req.body);

    if(inValid){
        return res.status(404).json(errors)
    }
    
    await Auth.findOne({email: email}).then(user => {
        if(user){

            if (bcrypt.compareSync(password, user.password)){

                const payload = { id: user.id, name: user.name, email: user.email };
            
                jwt.sign(payload, config.secretOrKey, { expiresIn: 43200 }, (err, token) => {
                    res.json({
                        status: 'success',
                        message: 'Successfully login.',
                        token
                    })
                })

            }
            else{
                errors.message = `Credentials doesn't exist`;
                res.status(404).json(errors)
            }
        }
        else{
            errors.message = `User not found.`;
            res.status(404).json(errors)
        }
    })
}

const currentUser = async (req, res) => {

    await Auth.findOne({email: req.body.email}).then( data => {
        res.json(data);
    })
}

module.exports = {
    register,
    login,
    currentUser
}