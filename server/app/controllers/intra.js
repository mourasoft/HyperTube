const intra = require('../utils/intra');
const db = require('../utils/db');
const bcrypt = require('bcrypt');
const token = require('../utils/token');


exports.register = async (req, res) => {
    
    const code = req.body.code;

    if (!code)
        res.status(400).json( {'status': 400, 'message': 'code is required'});

    try {

        const access_token = await intra.getaccesstoken(code);
        const user = await intra.getuser(access_token);

        console.log('user', user);
        // check if email already exists

        let u = await db.select(null, 'users', ['email'], [user.email]);
        if (u && u.length != 0)
            return res.status(400).json( {'status': 400, 'message': 'email already taken'});
        
        u = await db.select(null, 'users', ['username'], [user.username]);
        if (u && u.length != 0)
            return res.status(400).json( {'status': 400, 'message': 'username already taken'});


        let hash = bcrypt.hashSync("Test123@", 10);    
        let cols = ['firstname', 'lastname', 'username', 'email', 'password', 'image', 'verified'];
        let vals = [user.firstname, user.lastname, user.username, user.email, hash, user.image, 1];

        await db.insert('users', cols, vals);

        res.status(200).json({ 'status': 200, 'message': 'users registered successfully'})
        
    } catch (error) {
        res.status(401).json({'status':401, 'message': error.message});
    }
}



exports.login = async (req, res) => {

    const code = req.body.code;

    if (!code)
        res.status(400).json( {'status': 400, 'message': 'code is required'});

    try {
        let access_token = await intra.getaccesstoken(code);
        let user = await intra.getuser(access_token);

        let u = await db.select(null, 'users', ['email'], [user.email]);
        if (!u || u.length == 0)
            return res.status(403).json({ 'status': 403, 'message' : 'username or password incorrect'});

        u = u[0];
        delete u.password;
        delete u.verified;
        delete u.created_at;

        let t = token.generate(user);

        await db.pool.query(`INSERT INTO \`tokens\`(\`user_id\`, \`type\`, \`token\`) 
        VALUES ('${u.id}', 'access', '${t}') ON DUPLICATE KEY UPDATE token = '${t}'`);

        res.status(200).json({ 'status': 200, 'message': 'logged successfully', 'data': u, 'token': t});
        
    } catch (error) {
        res.status(401).json({'status':401, 'message': error.message});
    }
}
