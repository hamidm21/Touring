const express = require('express');
const router = express.Router();

// Middlewares
const redirectIfAuthenticated = require('app/http/middleware/redirectIfAuthenticated');
// const redirectIfNotAdmin = require('app/http/middleware/redirectIfNotAdmin');
const errorHandler = require('../../http/middleware/errorHandler');


// Home Router
const homeRouter = require('app/routes/web/home');
router.use('/' , homeRouter);

// Auth Router
const authRouter = require('app/routes/web/auth');
router.use('/auth' , redirectIfAuthenticated.handle ,authRouter);

//Handle errors
router.all('*' , errorHandler.error404);
router.use(errorHandler.handler);


module.exports = router;