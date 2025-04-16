import { inject, Container } from "inversify";
import TYPES from "../utils/constant/type";
import { Controller } from "./controller";
import * as express from "express";
import conf from "../utils/config";
import logger from "../utils/logger";
import { controller, request, response, httpPost, httpGet } from "inversify-express-utils";

export function controllerFactory(container: Container) {
    @controller("/user")
    class UserApi {
        constructor(@inject(TYPES.UserController) private cntr: Controller) { }

        @httpGet("/getAll",
            container.get<express.RequestHandler>("admin_auth"),
        )
        public async getUsers(@request() _req: express.Request, @response() res: express.Response) {
            try {
                const user = await this.cntr.getUsers();
                res.json(Object.assign({}, conf.resp, {
                    data: {
                        user,
                    },
                }));
            } catch (e) {
                logger.error({e});
                res.status(400).json(Object.assign({}, conf.resp, {
                    data: e,
                    errorCode: e.code,
                    message: e.message,
                    result: false,
                }));
            }
        }

        @httpPost("/registerWithRole",
            container.get<express.RequestHandler>("admin_auth"),
        )
        public async registerWithRole(@request() req: express.Request, @response() res: express.Response) {
            try {
                const user = await this.cntr.insertWithRole(req.body);
                res.json(Object.assign({}, conf.resp, {
                    data: {
                        user,
                    },
                }));
            } catch (e) {
                logger.error({e});
                res.status(400).json(Object.assign({}, conf.resp, {
                    data: e,
                    errorCode: e.code,
                    message: e.message,
                    result: false,
                }));
            }
        }

        @httpPost("/changePass",
        container.get<express.RequestHandler>("admin_auth"),
        )
        public async changePassword(@request() req: express.Request, @response() res: express.Response) {
            try {
                const user = await this.cntr.changePassword(req.body);
                res.json(Object.assign({}, conf.resp, {
                    data: {
                        user,
                    },
                }));
            } catch (e) {
                logger.error({e});
                res.status(400).json(Object.assign({}, conf.resp, {
                    data: e,
                    errorCode: e.code,
                    message: e.message,
                    result: false,
                }));
            }
        }

        @httpPost("/register")
        public async register(@request() req: express.Request, @response() res: express.Response) {
            try {
                const user = await this.cntr.register(req.body);
                res.json(Object.assign({}, conf.resp, {
                    data: {
                        user,
                    },
                }));
            } catch (e) {
                logger.error({e});
                res.status(400).json(Object.assign({}, conf.resp, {
                    data: e,
                    errorCode: e.code,
                    message: e.message,
                    result: false,
                }));
            }
        }

        @httpPost("/sendValidation")
        public async sendValidation(@request() req: express.Request, @response() res: express.Response) {
            try {
                const validation = await this.cntr.sendValidation(req.body.phoneNumber);
                res.json(Object.assign({}, conf.resp, {
                    data: {
                        Sent: validation,
                    },
                }));
            } catch (e) {
                logger.error({e});
                res.status(400).json(Object.assign({}, conf.resp, {
                    data: e,
                    errorCode: e.code,
                    message: e.message,
                    result: false,
                }));
            }
        }

        @httpPost("/checkValidation")
        public async checkValidation(@request() req: express.Request, @response() res: express.Response) {
            try {
                const checked = await this.cntr.checkValidation(req.body);
                res.json(Object.assign({}, conf.resp, {
                    data: {
                        ok: checked,
                    },
                }));
            } catch (e) {
                logger.error({e});
                res.status(400).json(Object.assign({}, conf.resp, {
                    data: e,
                    errorCode: e.code,
                    message: e.message,
                    result: false,
                }));
            }
        }

        @httpPost("/login")
        public async login(@request() req: express.Request, @response() res: express.Response) {
            try {
                const logedIn = await this.cntr.login(req.body);
                res.json(Object.assign({}, conf.resp, {
                    data: {
                        logedIn,
                    },
                }));
            } catch (e) {
                logger.error({e});
                res.status(400).json(Object.assign({}, conf.resp, {
                    data: e,
                    errorCode: e.code,
                    message: e.message,
                    result: false,
                }));
            }
        }

        @httpPost("/refreshToken")
        public async refreshToken(@request() req: express.Request, @response() res: express.Response) {
            try {
                const accessToken = await this.cntr.refreshToken(req.body.refreshToken);
                res.json(Object.assign({}, conf.resp, {
                    data: {
                        accessToken,
                    },
                }));
            } catch (e) {
                logger.error({e});
                res.status(400).json(Object.assign({}, conf.resp, {
                    data: e,
                    errorCode: e.code,
                    message: e.message,
                    result: false,
                }));
            }
        }

        @httpGet("/getHistory",
            container.get<express.RequestHandler>("user_auth"),
        )
        public async getHistory(@request() req: any, @response() res: express.Response) {
            try {
                const history = await this.cntr.getHistory(req.creds.payload);
                res.json(Object.assign({}, conf.resp, {
                    data: {
                        history,
                    },
                }));
            } catch (e) {
                res.status(400).json(Object.assign({}, conf.resp, {
                    data: e,
                    errorCode: e.code,
                    message: e.message,
                    result: false,
                }));
            }
        }

        @httpPost("/contactUs")
        public async contactUs(@request() req: express.Request, @response() res: express.Response) {
            try {
                const resp = await this.cntr.contactUs(req.body);
                res.json(Object.assign({}, conf.resp, {
                    data: {
                        resp,
                    },
                }));
            } catch (e) {
                logger.error({e});
                res.status(400).json(Object.assign({}, conf.resp, {
                    data: e,
                    errorCode: e.code,
                    message: e.message,
                    result: false,
                }));
            }
        }
    }
    return UserApi;
}
