// const User = require('app/models/user');
const middleware = require('./middleware');
const helpers = require("app/helpers");
const jwt = require("jsonwebtoken");
const conf = require("config/");
const refresh = require("app/helpers/authorizer");

class authorizer extends middleware {
    
    async handle(req , res ,next) {
        const cookies = new helpers(req, res).parseCookies();
        console.log({a: cookies.authToken, b: cookies.authRefresh})
        if (cookies.authRefresh && cookies.authToken) {
            jwt.verify(cookies.authToken, conf.session.jwtSecret, {}, async (err, decoded) => {
                console.log("verification started");
                if (err) {
                    if(err.name === "TokenExpiredError") {
                        console.log("token is expired");
                        req.cookie('authToken', await refresh.refreshToken(cookies.authRefresh));
                        handle();
                    }
                    else {
                        console.log({err});
                        throw err;
                    }
                }
                console.log({decoded})
                req.user = decoded;
                next();
            })
        } else if (cookies.authRefresh) {
            req.cookie('authToken', await refresh.refreshToken(cookies.authRefresh));
            handle();
        } else {
            res.redirect("/auth/login");
        }
    }
}


module.exports = new authorizer();