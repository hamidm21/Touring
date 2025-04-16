const controller = require('app/http/controllers/controller');
const loginController = require('app/http/controllers/auth/loginController');
const passport = require('passport');
const PasswordReset = require('app/models/password-reset');
const User = require('app/models/user');
const uniqueString = require('unique-string');
const auth = require('../../../models/auth');


class resetPasswordController extends controller {
    
    showResetPassword(req , res) {
        const title = 'بازیابی رمز عبور';
        res.render('home/auth/passwords/reset' , {
            title,
            token : req.params.token 
        });
    }
    showvalidcode(req , res) {
        const title = ' کدفعالسازی ';

        res.render('home/auth/passwords/valid' , {
            title,
            phone: req.query.phone,
            token : req.params.token
        });
    }

    async resetPasswordProccess(req  ,res , next) {

        let result = await this.validationData(req)

        let { vCode, phone } = req.body;

        const reg = JSON.parse(await auth.checkValid(phone, vCode));

        console.log(reg);

        if (reg.result) {
            req.body.password = "1234567"
            req.body.phonenumber = req.body.phone
            loginController.loginProccess(req, res, next)
        }
    }

    // async resetPassword(req ,res) {
    //     let field = await PasswordReset.findOne({ $and : [ { email : req.body.email } , { token : req.body.token } ]});
    //     if(! field) {
    //         req.flash('errors' , 'اطلاعات وارد شده صحیح نیست لطفا دقت کنید');
    //         return this.back(req,res);
    //     }
    //
    //     if(field.use) {
    //         req.flash('errors' , 'از این لینک برای بازیابی پسورد قبلا استفاده شده است');
    //         return this.back(req, res);
    //     }
    //
    //     let user = await User.findOneAndUpdate({ email : field.email } , { $set : { password : req.body.password }});
    //     if(! user) {
    //         req.flas('errors' , 'اپدیت شدن انجام نشد');
    //         return this.back();
    //     }
    //
    //    await field.update({ use : true});
    //    return res.redirect('/auth/login');
    // }

}

module.exports = new resetPasswordController();