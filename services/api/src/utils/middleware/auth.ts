import * as jwt from "jsonwebtoken";
import conf from "../config";
import logger from "../logger";

export const user = (req: any, res: any, next: any) => {
    // Express headers are auto converted to lowercase
    let token = req.headers.authorization;
    try {
        if (token && token.startsWith("Bearer ")) {
            token = token.slice(7, token.length);
            jwt.verify(token, conf.JWT.secret, {}, async (err: any, decoded: any) => {
                if (err) {
                    switch (err.name) {
                    case "TokenExpiredError":
                        res.status(401).json(Object.assign({}, req.base, {
                            data: err,
                            message: "EXPIRED",
                            result: false,
                        }));
                        break;
                    case "JsonWebTokenError":
                        res.status(401).json(Object.assign({}, req.base, {
                            data: err,
                            message: "ERROR",
                            result: false,
                        }));
                        break;
                    case "NotBeforeError":
                        res.status(401).json(Object.assign({}, req.base, {
                            data: err,
                            message: "ERROR",
                            result: false,
                        }));
                        break;
                    }
                } else {
                    logger.info({decoded});
                    req.creds = decoded;
                    next();
                }
            });
        } else {
            res.status(401).json(Object.assign({}, req.base, {
                message: "EMPTY",
                result: false,
            }));
        }
    } catch (e) {
        next(new Error(`Error in userGuard ${e}`));
    }
};

export const admin = (req: any, res: any, next: any) => {
    // Express headers are auto converted to lowercase
    let token = req.headers.authorization;
    try {
        if (token && token.startsWith("Bearer ")) {
            token = token.slice(7, token.length);
            // if (token !== "Rockafellers") {
            jwt.verify(token, conf.JWT.secret, {}, async (err: any, decoded: any) => {
                if (err) {
                    switch (err.name) {
                    case "TokenExpiredError":
                        res.status(401).json(Object.assign({}, req.base, {
                            data: err,
                            message: "EXPIRED",
                            result: false,
                        }));
                        break;
                    case "JsonWebTokenError":
                        res.status(401).json(Object.assign({}, req.base, {
                            data: err,
                            message: "ERROR",
                            result: false,
                        }));
                        break;
                    case "NotBeforeError":
                        res.status(401).json(Object.assign({}, req.base, {
                            data: err,
                            message: "ERROR",
                            result: false,
                        }));
                        break;
                    }
                } else {
                    logger.info({decoded});
                    if (decoded.payload.role === "admin") {
                        req.creds = decoded;
                        next();
                    } else {
                        res.status(401).json(Object.assign({}, req.base, {
                            data: {},
                            message: "NOT ADMIN",
                            result: false,
                        }));
                    }
                }
            });
            // } else {
            //     next();
            // }
        } else {
            res.status(401).json(Object.assign({}, req.base, {
                message: "EMPTY",
                result: false,
            }));
        }
    } catch (e) {
        next(new Error(`Error in userGuard ${e}`));
    }
};
