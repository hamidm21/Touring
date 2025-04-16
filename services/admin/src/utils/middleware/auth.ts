import passport from "passport";
import passportLocal from "passport-local";
import { findById, findOne, comparePass } from "../../user";
import { Role } from "../../entity/user.entity";
import { EMsgs } from "../config";
import logger from "../logger";
import { User } from "../../entity";

// using local strategy for authentication
const LocalStrategy = passportLocal.Strategy;

passport.serializeUser<any, any>((_req, user, done) => {
    done(null, user);
});

passport.deserializeUser((session: User, done) => {
    logger.info("deserialize")
    findById(session.id, { relations: ["tour", "agency"]} ).then((user) => {
        logger.info({user, session})
        done(null, user);
    }).catch((e) => {
        done(e, false);
    });
});

/**
 * Sign in using phoneNumber and Password.
 */
passport.use(new LocalStrategy({ usernameField: "phoneNumber" }, async (phoneNumber, password, done) => {
    findOne({phoneNumber, role: Role.LEADER}, {relations: ["agency"]}).then((user: any) => {
        if (!user) {
            return done(undefined, undefined, { message: EMsgs.PHN_WRONG });
        }
        comparePass(password, user.password).then((isMatch: boolean) => {
            if (!isMatch) {
                return done(undefined, undefined, { message: EMsgs.PSW_WRONG });
            }
            return done(null, user);
        });
    }).catch((e: any) => {
        return done(e);
    });
}));

// export default function initAuth(app: Express.Application): void {
//     passport.use(
// new LocalStrategy({ usernameField: "phoneNumber" }, async (phoneNumber: number, password: string, done: boolean) => {

//         })
//     )
// }

export const isAuthenticated = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
};
