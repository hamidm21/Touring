import { inject, Container } from "inversify";
import TYPES from "../utils/constant/type";
import { Controller } from "./controller";
import * as express from "express";
import conf from "../utils/config";
import { controller, request, response, httpGet, httpPost } from "inversify-express-utils";
import logger from "../utils/logger";

export function controllerFactory(container: Container) {
    @controller("/payment")
    class PayApi {
        constructor(@inject(TYPES.PayController) private cntr: Controller) { }

        @httpPost("/requested",
            container.get<express.RequestHandler>("user_auth"),
        )
        public async requestPayment(@request() req: any, @response() res: express.Response) {
            try {
                const payment = await this.cntr.requestPayment({creds: req.creds.payload, body: req.body});
                res.json(Object.assign({}, conf.resp, {
                    data: {payment},
                }));
            } catch (e) {
                logger.error({e});
                res.status(400).json(Object.assign({}, conf.resp, {
                    data: e,
                    message: e.message,
                    result: false,
                }));
            }
        }

        @httpPost("/request")
        public async request2(@request() req: any, @response() res: express.Response) {
            try {
                const payment = await this.cntr.requestUnAuthPayment({body: req.body});
                res.json(Object.assign({}, conf.resp, {
                    data: {payment},
                }));
            } catch (e) {
                logger.error({e});
                res.status(400).json(Object.assign({}, conf.resp, {
                    data: e,
                    message: e.message,
                    result: false,
                }));
            }
        }

        @httpPost("/unAuthRequest")
        public async requestUnAuthPayment(@request() req: any, @response() res: express.Response) {
            try {
                const payment = await this.cntr.requestUnAuthPayment({body: req.body});
                res.json(Object.assign({}, conf.resp, {
                    data: {payment},
                }));
            } catch (e) {
                logger.error({e});
                res.status(400).json(Object.assign({}, conf.resp, {
                    data: e,
                    message: e.message,
                    result: false,
                }));
            }
        }

        @httpGet("/check")
        public async paymentCheck(@request() req: express.Request, @response() res: express.Response) {
            try {
                const trip = await this.cntr.paymentCheck(req.query);
                const url = `http://3tour.ir/paymentDone?refId=${trip.refId}&tourName=${trip.tourName}&tripName=${trip.tripName}&amount=${trip.amount}&returnTo=${trip.return}&success=${trip.success}`;
                res.redirect(url);
            } catch (e) {
                logger.error({e});
                res.status(400).json(Object.assign({}, conf.resp, {
                    data: e,
                    message: e.message,
                    result: false,
                }));
            }
        }
    }
    return PayApi;
}
