const crypto = require('crypto');
var jwt = require('jsonwebtoken');
import { addErrorLog } from './errorLog.service.controller';
import { createClient } from '../helper';

const pg = require("pg");

export const addUser = async function (req, res) {
    //Validation
try{
    if (!req.body.usertypeid)
        return res.json({ 'success': false, 'message': 'User type id Not Found.' });

    if (!req.body.fullname)
        return res.json({ 'success': false, 'message': 'Full Name Not Found.' });

    if (!req.body.mobile)
        return res.json({ 'success': false, 'message': 'Mobile No. Not Found.' });

    if (!req.body.email)
        return res.json({ 'success': false, 'message': 'E-mail Not Found.' });


    if (!req.body.username)
        return res.json({ 'success': false, 'message': 'User Name Not Found.' });

    if (!req.body.password)
        return res.json({ 'success': false, 'message': 'Password  Not Found.' });

    if (!req.body.roleid)
        return res.json({ 'success': false, 'message': 'Role Id  Not Found.' });
    // creating a unique salt for a particular user

    var salt = crypto.randomBytes(16).toString('hex');
    var hash = crypto.pbkdf2Sync(req.body.password, salt, 1000, 64, 'sha512').toString('hex');
    var client = await createClient();
    client.connect();

    const insertUserQuery = 'INSERT INTO m_users(fullname, mobile, username, salt, hash, roleid, email, usertypeid)VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
    const values = [req.body.fullname, req.body.mobile, req.body.username, salt, hash, req.body.roleid, req.body.email, req.body.usertypeid];
    await client.query(insertUserQuery, values)
        .then(result => {
            client.end();
            return res.json({ 'success': true, 'message': 'User Added Successfully' });
        })
        .catch(err => {
            client.end();
            addErrorLog(err);
            return res.json({ 'success': false, 'message': err.message });
        });
} catch(err){
    addErrorLog(err);
}
}

export const loginUser = async function (req, res) {
try{
    var username = req.body.username;
    var password = req.body.password;
    var usertypeid = 1;
    if (!req.body.username)
        return res.json({ 'success': false, 'message': 'Username  Not Found.' });

    if (!req.body.password)
        return res.json({ 'success': false, 'message': 'Password Not Found.' });

    var client = await createClient();
    client.connect();
    client.query('SELECT * FROM m_users WHERE LOWER(username) = LOWER($1) AND usertypeid = $2  AND active = true', [username, usertypeid], function (err, users) {
        
        if (err) {
            client.end();
            return res.json({ 'success': false, 'message': err });
        }
        if (users.rows.length) {
            var user = users.rows[0];
            // Compare Passwords
            if (validPassword(password, user.salt, user.hash)) {
                let userToken = generateJwt(user);
                 res.cookie("SESSIONID", userToken, { httpOnly: true, secure: false });
                var responseObj = {
                    "token": userToken,
                    'id': user.id,
                    'userName': user.username,
                    'fullName': user.fullname,
                    'email': user.email,
                    'userTypeId': user.usertypeid
                };
                return res.json({ 'success': true, 'data': responseObj});

            } else
                return res.json({ 'success': false, 'message': 'UserName or Password Invalid' });

        } else {
            return res.json({ 'success': false, 'message': 'UserName or Password Invalid' });
        }
    })
} catch(err){
    client.end();
    addErrorLog(err);
}

}



export const changePass = async function (req, res) {
    //Validation
    if (!req.body.password)
        return res.json({ 'success': false, 'message': 'Password Not Found.' });
 
        var salt = crypto.randomBytes(16).toString('hex');
        var hash = crypto.pbkdf2Sync(req.body.password, salt, 1000, 64, 'sha512').toString('hex');

        var client = await createClient();
        client.connect();
    const text = 'UPDATE m_users SET salt=$1, hash=$2 WHERE user_id = $3';
    const values = [salt, hash, req.params.id];
    client.query(text, values)
        .then(result => {
            client.end();
            return res.json({ 'success': true, 'message': 'Password Updated Successfully' });
        })
        .catch(err => {
            client.end();
            addErrorLog(err);
            return res.json({ 'success': false, 'message': err.message });
        });
}





export const UpdateUserPass = async function(req, res){
   
    //Validation
    var password = req.body.old_password;
console.log(password);
    if(!req.body.old_password)
    return res.json({'success':false, 'message':'Old Password not found'});

    if(!req.body.password)
    return res.json({'success': false, 'message':'Password not Found.'});

    var salt = crypto.randomBytes(16).toString('hex');
    var hash = crypto.pbkdf2Sync(req.body.password, salt, 1000, 64, 'sha512').toString('hex');

    var client = await createClient();
    client.connect();
    client.query('SELECT * FROM m_users  WHERE user_id = $1', [req.user.user_id], function (err, user) {
        if (err) {
            addErrorLog(err);
            return res.json({ 'success': false, 'message': 'Error getting user' });
        }
        if (user.rows.length) {  
            // Compare Passwords
            if (validPassword(old_password, user.rows[0].salt, user.rows[0].hash)) {
                const text = 'UPDATE m_users SET salt=$1, hash=$2 WHERE user_id = $3';
                const values = [salt, hash, req.user.user_id];
                client.query(text, values)
                    .then(result => {
                        client.end();
                        return res.json({ 'success': true, 'message': 'Password Updated Successfully' });
                    })
                    .catch(err => {
                        client.end();
                        addErrorLog(err);
                        return res.json({ 'success': false, 'message': err.message });
                    });           
 
            } else{
                
                return res.json({ 'success': false, 'message':"Old Pasword not Matched" });
                
            }}
    })

}


export const getUser = async function (req, res) {
    try{
    var client = await createClient();
    client.connect();
    client.query('SELECT * FROM m_users WHERE id = $1', [req.params.id], function (err, result) {
        // closing the connection;
        client.end();
        if (result) {
            res.status(200).send(result.rows);
        }
        if (err) {
            addErrorLog(err);
            return res.json({ 'success': false, 'message': 'Unable to load data' });
        }
    });
} catch(err){
    addErrorLog(err);
}
}

export const logoutUser = (req, res) => {
    try{
    res.clearCookie('SESSIONID');
    return res.json({ 'success': true, message: 'User Logged Out.' });
    }catch(err){
        addErrorLog(err);
    }
}



export const loginRequiredUser = (req, res, next) => {
    if (req.user) {
        console.log(req.user);
        next();
    } else {
        return res.json({ 'success': false, message: 'Access Denied.' });
    }
};


var validPassword = function (password, salt, hash) {
    var new_hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
    return hash === new_hash;
};
var generateJwt = function (user) {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        id: user.id,
        email: user.fullname,
        username: user.username,
        fullName: user.fullname,
        email: user.email,
        userTypeId: user.usertypeid,
        roleId: user.roleid,
        exp: parseInt(expiry.getTime() / 1000),
    }, 'llp');
};
