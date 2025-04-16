const joi = require("@hapi/joi");

exports.form = joi.object({
    fullName: joi.string().required().regex(/[\u0621-\u064A]*/),
    mid: joi.string().length(10),
    phoneNumber: joi.string().length(11)
});

exports.joi = joi;