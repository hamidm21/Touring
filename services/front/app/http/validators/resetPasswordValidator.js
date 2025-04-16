const validator = require('./validator');
const { check } = require('express-validator/check');

class forgotPasswordValidator extends validator {
    
    handle() {
        return [
            check('vCode')
                .not().isEmpty()
                .withMessage('کد فعالسازی نمیتواند خالی باشد'),

            check('phone')
                .not().isEmpty()
                .withMessage('کد فعالسازی نمیتواند خالی باشد'),
        ]
    }
}

module.exports = new forgotPasswordValidator();