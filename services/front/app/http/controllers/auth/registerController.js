const controller = require('app/http/controllers/controller');
const passport = require('passport');
const User = require('app/models/user');
const auth = require('../../../models/auth');

class registerController extends controller {

    showRegsitrationForm(req , res) {
        const title = 'صفحه عضویت';
        const errors = req.flash("error");

        console.log(errors);
        

        res.render('home/auth/register' , { errors, title });

    }

    async registerProccess(req ,res , next) {

        let result = await this.validationData(req);
        let { name,mid , phoneNumber , password } = req.body;
        auth.register(name , mid , phoneNumber , password).then((data) => {
            const ans = JSON.parse(data);
            res.redirect(`/auth/password/valid?phone=${phoneNumber}`);
        }).catch((e) => {
            const err = JSON.parse(e.error)
            console.log({e: err.errorCode});
            switch (err.errorCode) {
                case 1006:
                    req.flash("error", "قبلا کاربری با این اطلاعات ثبت شده است")
                    res.redirect("/auth/register")
                    break;
                default:
                    req.flash("error", "در فرایند ثبت نام مشکلی پیش آمده است")
                    res.redirect("/auth/register")
                    break;
            }
        });
    }
    
    register(req , res , next) {
        passport.authenticate('local.register' , { 
            successRedirect : '/',
            failureRedirect : '/auth/register',
            failureFlash : true
        })(req, res , next);
    }



}

module.exports = new registerController();