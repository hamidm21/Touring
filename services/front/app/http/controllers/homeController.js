const controller = require('app/http/controllers/controller');
const Course = require('app/models/course');
const User = require('app/models/trips');
const sm = require('sitemap');
const rss = require('rss');
const striptags = require('striptags');
const trips = require('../../models/trips');
const helper = require("app/helpers");

class homeController extends controller {
    
    async index(req , res) {

        const cookies = new helper(req, res).parseCookies();
        const recentTrips = JSON.parse(await trips.getRecents(16, 1));
        const getPopular = JSON.parse(await trips.getPopular(4, 1));
        const getSuggested = JSON.parse(await trips.getSuggested(4, 1));
        console.log(recentTrips.data.trips)
        res.render('home/index' , { recentTrips : recentTrips.data.trips , getPopular : getPopular.data.trips , getSuggested : getSuggested.data.trips });
    }

    async landing(req , res) {
        res.render('home/landing', {theme: "ajsldkjasldkjalsdjl"} );
    }
    async about(req , res) {
        res.render('home/aboutus');
    }
    async faq(req , res) {
        res.render('home/faq');
    }
    async contactUs(req , res) {
        console.log(req.path)
        res.render('home/contactUs' , {success: ""});
    }
    async contactUsPost(req , res) {
        const {
            fullName,
            text,
            subject,
            contactInfo
        } = req.body
        const resp = await JSON.parse(await User.contactUs(fullName , text, subject, contactInfo));
        console.log(resp);
        res.render('home/contactUs', {success: "پیام شما با موفقیت ارسال شد"});
    }
    async paymentDone(req , res) {
        res.render('home/paymentDone');
    }

    async sitemap(req , res , next) {
        try {
                let sitemap = sm.createSitemap({
                    hostname : config.siteurl ,
                    cachTime : 600000
                });
                sitemap.add({ url : '/' , changefreq : 'daily' , priority : 1  });
                sitemap.add({ url : '/post' , priority : 1 });

                let courses =  await Course.find({ }).sort({ createdAt : -1 });
                courses.forEach(course => {
                    sitemap.add({ url : course.path() , changefreq : 'weekly' , priority: 0.8})

                });

            res.header('content-type' , 'application/xml');
            res.send(sitemap.toString());

        } catch (err) {
            next(err);
        }
    }
    async feedCourses(req , res , next) {
        try {
            let feed = new rss({
                title : 'فید خوان مطالب  ',
                description : 'جدیدترین مطالب  را از طریق rss بخوانید',
                feed_url : `${config.siteurl}/feed/post`,
                site_url : config.site_url,
            });

            let courses = await Course.find({ }).populate('user').sort({ createdAt : -1 }).exec();
            courses.forEach(course => {
                feed.item({
                    title : course.title,
                    description : striptags(course.body.substr(0,100)),
                    date : course.createdAt,
                    url : course.path(),
                    author : course.user.name
                })
            });

            res.header('Content-type' , 'application/xml');
            res.send(feed.xml());

        } catch (err) {
            next(err);
        }
    }
}

module.exports = new homeController();