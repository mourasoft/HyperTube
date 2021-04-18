const bcrypt = require('bcrypt');
const db = require('../utils/db');
const valid = require('../utils/validation');
const mail = require('../utils/mail');
const token = require('../utils/token');



exports.me = async (req, res) => {
    let user = req.user;

    try {
        user = await db.select(null, 'users', ['id'], [user.id]);
        user = user[0];

        delete user.password;
        delete user.verified;
        delete user.created_at;

        res.status(200).json( {'status': 200, 'message': 'success', 'user': user});
    } catch(error) {
        res.status(500).json({'status': 500, 'message': error.message});
    }
}


exports.info = async (req, res) => {
    let user = req.user;

    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;


    if (!firstname || !lastname || !username || !email)
        return res.status(400).json({ 'status': 400, 'message': 'missing parameters'});

    if (!password)
        return res.status(400).json({ 'status': 400, 'message': 'password required'});

    try {
        user = await db.select(null, 'users', ['id'], [user.id]);
        user = user[0];
        
        if (!bcrypt.compareSync(password, user.password))
            return res.status(400).json({ 'status': 400, 'message': 'password incorrect'});
        
        if (!valid.firstname(firstname))
            return res.status(400).json({ 'status': 400, 'message': 'firstname not valid'});

        if (!valid.lastname(lastname))
            return res.status(400).json({ 'status': 400, 'message': 'lastname not valid'});

        if (!valid.username(username))
            return res.status(400).json({ 'status': 400, 'message': 'username not valid'});

        if (!valid.email(email))
            return res.status(400).json({ 'status': 400, 'message': 'email not valid'});

        // check if username already taken then update
        if (username != user.username) {
            let data = await db.select(null, 'users', ['username'], [username]);
            if (data && data.length != 0)
                return res.status(400).json({ 'status': 400, 'message': 'username already taken'});
            await db.update('users', 'username', username, 'id', user.id);
        }

        // check if email already taken then update
        if (email != user.email) {
            let data = await db.select(null, 'users', ['email'], [email]);
            if (data && data.length != 0)
                return res.status(400).json({ 'status': 400, 'message': 'email already taken'});
            await db.update('users', 'email', email, 'id', user.id);
            await db.update('users', 'verified', 0, 'id', user.id);
            await mail.confirm_account(email);
        }

        if (firstname != user.firstname)
            await db.update('users', 'firstname', firstname, 'id', user.id);

        if (lastname != user.lastname)
            await db.update('users', 'lastname', lastname, 'id', user.id);

        res.status(200).json( {'status': 200, 'message': 'updated successfully'});
        
    } catch (error) {
        console.log('update error:', error);
        res.status(500).json({'status': 500, 'message': error.message});
    }
}

exports.password = async (req, res) => {

    let user = req.user;

    const password = req.body.password;
    const newpassword = req.body.newpassword;
    const newconfirm = req.body.newconfirm;

    if (!newpassword || !newconfirm)
        return res.status(400).json( {'status': 400, 'message': 'missing parameters'});

    if (!password)
        return res.status(400).json({ 'status': 400, 'message': 'password required'});

    if (!valid.password(newpassword))
        return res.status(400).json({ 'status': 400, 'message': 'password not valid'});

    if (!valid.password(newconfirm))
        return res.status(400).json({ 'status': 400, 'message': 'confirm password not valid'});
    
    if (newpassword !== newconfirm)
        return res.status(400).json({ 'status': 400, 'message': 'password and confirm does not match'});

    try {
        user = await db.select(null, 'users', ['id'], [user.id]);
        user = user[0];

        if (!bcrypt.compareSync(password, user.password))
            return res.status(400).json({ 'status': 400, 'message': 'password incorrect'});
        
        let hash = bcrypt.hashSync(newpassword, 10);
        await db.update('users', 'password', hash, 'id', user.id);

        delete user.password;
        delete user.verified;
        delete user.created_at;

        let t = token.generate({user});
        await db.pool.query(`INSERT INTO \`tokens\`(\`user_id\`, \`type\`, \`token\`) 
        VALUES ('${user.id}', 'access', '${t}') ON DUPLICATE KEY UPDATE token = '${t}'`);
        
        res.status(200).json( {'status': 200, 'message': 'password updated successfully'});
    } catch (error) {
        console.log('error:', error);
        res.status(500).json({ 'status': 500, 'message': error.message});
    }
}


exports.upload = async (req, res) => {

    
    const user = req.user;


    res.status(200).json({'user' : user});

}