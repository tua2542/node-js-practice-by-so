const express = require('express');

const app = express();

app.use('/', (req, res, next) => {
    console.log('middleware');
    next();
});

app.use('/users', (req, res, next) => {
    console.log('another middleware');
    res.send('<h1>My username is sot</h1>');
});

app.use('/', (req, res, next) => {
    console.log('another middleware');
    res.send('<h1>Welcome</h1>');
});

app.listen(3000);