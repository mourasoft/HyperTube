const db = require('../utils/db');
const validation = require('../utils/validation');
const bcrypt = require('bcrypt');
const mail = require('../utils/mail');
const config = require('../config/config');

exports.register = async (req, res) => {

    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const confirm = req.body.confirm;

    if (!firstname || !lastname || !username || !email || !password || !confirm )
        return res.status(403).json({ 'status' : 403, 'message': 'missing parameters'});

    if (!validation.firstname(firstname))
        return res.status(403).json({ 'status' : 403, 'message': 'firstname is not valid'});

    if (!validation.lastname(lastname))
        return res.status(403).json({ 'status' : 403, 'message': 'lastname is not valid'});

    if (!validation.username(username))
        return res.status(403).json({ 'status' : 403, 'message': 'username is not valid'});

    if (!validation.email(email))
        return res.status(403).json({ 'status' : 403, 'message': 'email is not valid'});

    if (!validation.password(password) || !validation.password(confirm) || password !== confirm)
        return res.status(403).json({ 'status' : 403, 'message': 'password is not valid'});

    try {

        let u = await db.select(['username'], ['users'], ['username'], [username]);
        let e = await db.select(['email'], ['users'], ['email'], [email]);

        if (u && u.length)
            return res.status(403).json({ 'status' : 403, 'message': 'username already exists'});

        if (e && e.length)
            return res.status(403).json({ 'status' : 403, 'message': 'email already exists'});
        
        let hash = bcrypt.hashSync(password, 10);    

        let cols = ['firstname', 'lastname', 'username', 'email', 'password', 'image'];
        let vals = [firstname, lastname, username, email, hash, `/images/default.svg`];

        await db.insert('users', cols, vals);
        
        await mail.confirm_account(email);

        res.status(200).json({
            'status': 200,
            'message' : 'registered successfuly'
        });

    } catch (error) {
        res.status(500).json({'status': 500, 'message': error.message});
    }
}