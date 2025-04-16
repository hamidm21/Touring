import express from "express";
import ejsLayouts from "express-ejs-layouts";
import compression from "compression";
import morgan from "morgan";
import router from "./utils/middleware/router";
import session from "express-session";
import conf from "./utils/config";
import connect from 'connect-mongo'
import path from "path";
import passport from "passport";
import logger from "./utils/logger";

const app = express();
const MongoStore = connect(session);
// set veiw engine
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");
app.use(ejsLayouts);

// Set authentication
const mongoUrl = conf.session.mongo_host;
// const MongoDBStores = connectMongoDBSession(session);
app.use(session({
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        secure: false,
    },
    resave: true,
    saveUninitialized: true,
    secret: conf.session.secret || "secret",
    store: new MongoStore({
        url: mongoUrl,
        autoReconnect: true
    }),
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("dev"));
app.use(passport.initialize());
app.use(passport.session());

app.use((req: any, res: any, next) => {
    if (req.path === "/") {
        res.redirect("/dashboard");
    }
    // After successful login, redirect back to the intended page
    if (!req.user &&
    req.path !== "/login" &&
    !req.path.match(/^\/auth/) &&
    !req.path.match(/\./)) {
        req.session.returnTo = req.path;
    } else if (req.user &&
    req.path === "/account") {
        req.session.returnTo = req.path;
    }
    next();
});
app.use((req, _res, next) => {
    Object.assign(req, {
        base: {
            data: {},
            errorCode: 0,
            message: "",
            result: true,
        },
    }),
    next();
});

router(app);

// handling 404s;
app.get("*", (_req, res) => {
    res.render("pages/404");
});

app.listen( 5252 , () => {
    logger.info("app is listening on 5252");
});
