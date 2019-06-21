// ./express-server/app.js
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import logger from 'morgan';
import cors from 'cors';
import SourceMapSupport from 'source-map-support';
//const cors = require('cors');
// import routes
import instractionRoutes from './routes/instraction.server.route';
import userRoutes from './routes/users.server.route';
var cookieParser = require('cookie-parser');
import jwt from 'jsonwebtoken';

// define our app using express
const app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:5200");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Origin, Expires, Authorization, Accept, Cache-Control, Pragma");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
})


// configure app
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    var token = req.headers['authorization'];

    if (!token) {
        req.user = undefined;
        next();
    }
    else {
        token = token.replace('bearer ', '');

        jwt.verify(token, 'llp', function (err, decode) {
            if (err) req.user = undefined;
            req.user = decode;
            next();
        });

    }
});


// set the port
const port = process.env.PORT || 3109;

// port.timeout = 240000;  
// connect to database



// add Source Map Support
SourceMapSupport.install();

app.use('/api',
    instractionRoutes,
    userRoutes);
app.get('/', (req, res) => {
    return res.end('Api working');
})
// catch 404
app.use((req, res, next) => {
    res.status(404).send('<h2 align=center>Page Not Found!</h2>');
});
// start the server
app.listen(port, () => {
    console.log(`App Server Listening at ${port}`);
});