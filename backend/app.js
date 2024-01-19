const express = require('express');

const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed');

const postModel  = require('./models/post');

const cors = require('cors');

const app = express();

app.use(bodyParser.json());

app.use(cors());


app.use('/feed', feedRoutes);

postModel.createPostsTable();

app.listen(8080);
