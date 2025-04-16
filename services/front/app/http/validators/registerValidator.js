const validator = require('./validator');
const { check } = require('express-validator/check');

class registerValidator extends validator {
    
    handle() {
        return [
            check('name')
                .isLength({ min : 5 })
                .withMessage('فیلد نام نمیتواند کمتر از 5 کاراکتر باشد'),
            check('mid')
                .isLength({ min : 10 })
                .withMessage('کدملیس نمیتواند کمتر از 10 کاراکتر باشد'),

            check('phoneNumber')
                .isLength({ min : 11 })
                .withMessage('فیلد شماره تلفن معتبر نیست'),

            check('password')
                .isLength({ min : 5 })
                .withMessage('فیلد پسورد نمیتواند کمتر از 5 کاراکتر باشد'),
        ]
    }
}

module.exports = new registerValidator();