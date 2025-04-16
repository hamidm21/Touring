const req = require("request-promise");
const conf = require("config/index");

exports.register = async function (fullName , mid ,phoneNumber ,password) {
    return await req({
        uri: conf.service.apiAdd.web_add + "/user/register",
        method: "POST",
        form : {
            fullName , mid ,phoneNumber ,password
}
});
};
exports.login = async function (phoneNumber , password) {
    return await req({
        uri: conf.service.apiAdd.web_add + "/user/login",
        method: "POST",
        form : {
            phoneNumber , password
        }
    });
};

exports.checkValid = async function (phoneNumber , vCode) {
    return await req({
        uri: conf.service.apiAdd.web_add + "/user/checkValidation",
        method: "POST",
        form : {
            phoneNumber , vCode
        }
    });
};
exports.sendValid = async function (phoneNumber ) {
    return await req({
        uri: conf.service.apiAdd.web_add + "/user/login",
        method: "POST",
        form : {
            phoneNumber
        }
    });
};



