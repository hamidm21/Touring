import express from "express";
const router = express.Router();
import passport from "passport";
import { EMsgs } from "../utils/config";
import logger from "../utils/logger";

router.get("/",
    async (req: express.Request, res: express.Response, _next: express.NextFunction) => {
        if (!req.user) {
            res.render("pages/login");
        } else {
            res.redirect("/dashboard");
        }
});

router.post("/",
    async (req: any, res: express.Response, next: express.NextFunction) => {
        passport.authenticate("local", (err: Error, user: any, info: any) => {
            if (err) {
                logger.error({err});
                res.locals.errors = EMsgs.UNKNOWN;
                return res.render("pages/login");
            } else if (!user) {
                res.locals.errors = info.message;
                return res.render("pages/login");
            } else {
                req.logIn(user, (e: any) => {
                    if (e) {
                        logger.error({e});
                        res.locals.errors = EMsgs.UNKNOWN;
                        return res.render("pages/login");
                     } else {
                        res.redirect(req.session.returnTo || "/dashboard");
                     }
                });
            }
        })(req, res, next);
});

/**
 * GET /logout
 * Log out.
 */
router.get("/logout",
    async (req: express.Request, res: express.Response, _next: express.NextFunction) => {
        req.logout();
        res.render("pages/login");
});

export { router };
