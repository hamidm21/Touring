const req = require("request-promise");
exports.refreshToken = async function(refreshToken) {
    const token = JSON.parse(await req({
        uri: "http://api:2121/user/refreshToken",
        method: "POST",
        form : {
            refreshToken
        }
    }));
    return token.data.accessToken;
};
