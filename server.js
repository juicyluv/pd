// подключение необходимых библиотек
const express = require('express');
const path = require('path');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const expressSession = require('express-session');

const db = require('./config/database');

// роутеры
const indexRouter = require('./routes/index');
const postRouter = require('./routes/post');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const commentRouter = require('./routes/comment');

// порт сервера
const PORT = process.env.PORT || 80;

// создание express приложения
const app = express();

// позволяет приложению использовать json формат данных
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressSession({ resave: true, secret: process.env.SESSION_KEY, saveUninitialized: true }));
app.use(cors());
app.use(fileUpload());

// инициализация статического каталога
app.use(express.static(path.resolve(__dirname, 'public')));

// глобальная переменная для определения входа юзера и его роли
global.loggedIn = global.role = global.nickname = null;
app.use("*", (req, res, next) => {
    loggedIn = req.session.userId;
    role = req.session.role;
    nickname = req.session.nickname;
    next();
});

// api
app.use('/', indexRouter);
app.use('/post', postRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/comment', commentRouter);

// 404 error
app.use((req, res) => res.render('notfound', { title: '#404: Page Not Found' }));

// template engine
app.set('view engine', 'ejs');




/*
    запуск приложения
*/
start();

// функция подключается к базе данных и запускает сервер
async function start() {
    try {
        console.log(`Successfully connected to the database '${process.env.DB_NAME}'`);
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch(error) {
        console.error(error);
    }
}