const path = require('path');

const express = require('express');

const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');


const postModel  = require('./models/post');
const userModel  = require('./models/user');


const multer = require('multer');

const cors = require('cors');

const app = express();

const { v4: uuidv4 } = require('uuid');

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4());

    },
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || 
    file.mimetype === 'image/jpg' || 
    file.mimetype === 'image/jpeg'){
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.use(bodyParser.json());
app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter}).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(cors());


app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);


app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status);
    res.status(status).json({ message: message});
});

postModel.createPostsTable();
userModel.createUserTable();

app.listen(8080);