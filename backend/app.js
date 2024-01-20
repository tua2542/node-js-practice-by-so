const path = require('path');

const express = require('express');

const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed');

const postModel  = require('./models/post');

const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(cors());


app.use('/feed', feedRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status);
    res.status(status).json({ message: message});
});

postModel.createPostsTable();

app.listen(8080);
