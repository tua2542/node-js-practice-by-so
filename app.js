const express = require('express');

const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed');

const cors = require('cors')

const app = express();

app.use(bodyParser.json());

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, PATCH');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     next();
// });

app.use(cors());


app.use('/feed', feedRoutes);

app.listen(8080);