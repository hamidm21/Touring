const controller = require('app/http/controllers/controller');
const passport = require('passport');
const auth = require('../../../models/auth');

class loginController extends controller {
    
    showLoginForm(req , res) {
        const title = 'صفحه ورود';
        const errors = req.flash("error")
        console.log({errors})
        res.render('home/auth/login' , {errors, title });
    }

    async loginProccess(req  ,res , next) {

        let result = await this.validationData(req);
        if(result) {
            let { phonenumber, password } = req.body;
            console.log(req.body)
            auth.login( phonenumber, password).then((data) => {
                const logged = JSON.parse(data);
                res.cookie('authToken',logged.data.logedIn.accessToken);
                res.cookie('authRefresh',logged.data.logedIn.refreshToken);
                console.log({log: logged.data});
                res.redirect("/");
            }).catch((e) => {
                const err = JSON.parse(e.error)
                console.log({e: err});
                switch (err.errorCode) {
                    case 1009:
                        req.flash("error", "رمز عبور اشتباه")
                        res.redirect("/auth/login")
                        break;
                    case 1008:
                        req.flash("error", "کاربری با این اطلاعات پیدا نشد")
                        res.redirect("/auth/login")
                        break;
                    case 1007:
                        req.flash("error", "شماره شما تایید نشده لطفا کد ارسال شده را وارد کنید")
                        res.redirect("/auth/passwrod/valid")
                        break;
                    default:
                        req.flash("error", "در فرایند ثبت نام مشکلی پیش آمده")
                        res.redirect("/auth/login")
                        break;
                }
                req.flash("error", "در فرایند ثبت نام مشکلی پیش آمده")
                return res.redirect("/auth/login")
            });
        } 
        
        // this.back(req,res);
    }

    login(req ,res , next) {
        passport.authenticate('local.login' , (err , user) => {
            if(!user) return res.redirect('/auth/login');

            req.logIn(user , err => {

                return res.redirect('/');
            });

        })(req, res , next);
    }

}

module.exports = new loginController();