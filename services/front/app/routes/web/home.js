const express = require('express');
const router = express.Router();
// Middleware
const Middleware = require("app/http/middleware/authorizer");
// Controllers
const homeController = require('app/http/controllers/homeController');
const courseController = require('app/http/controllers/courseController');

router.get('/logout' , (req ,res) => {
    req.logout();
    res.clearCookie('remember_token');
    res.redirect('/');
});

// Home Routes
router.get('/' , homeController.index);
router.get('/landing' , homeController.landing);
router.get('/post' , courseController.index);
router.get('/trips' , courseController.posts);
router.get('/search' , courseController.index);
router.get('/aboutUs' , homeController.about);
router.get('/rules' , homeController.faq);
router.get('/paymentDone' , homeController.paymentDone);
router.get('/contactUs' , homeController.contactUs);
router.post('/contactUs' , homeController.contactUsPost);
router.get('/trip/:slug' , courseController.single);
router.get('/trip/:slug/sign', courseController.signGet);
router.post('/trip/:slug/sign', courseController.sign);


router.get('/sitemap.xml' , homeController.sitemap);
router.get('/feed/post' , homeController.feedCourses);

module.exports = router;