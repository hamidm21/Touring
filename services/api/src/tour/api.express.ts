import { inject, Container } from "inversify";
import TYPES from "../utils/constant/type";
import { Controller } from "./controller";
import * as express from "express";
import conf from "../utils/config";
import { controller, request, response, httpGet, httpPost } from "inversify-express-utils";
import logger from "../utils/logger";

export function controllerFactory(container: Container) {
    @controller("/tour")
    class TourApi {
        constructor(@inject(TYPES.TourController) private cntr: Controller) { }

        @httpGet("/getSuggested")
        public async getSuggested(@request() _req: express.Request, @response() res: express.Response) {
            try {
                const trips = await this.cntr.getSuggested();
                res.json(Object.assign({}, conf.resp, {
                    data: trips,
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

        @httpPost("/getOne")
        public async getOne(@request() req: express.Request, @response() res: express.Response) {
            try {
                const trip = await this.cntr.getOne(req.body.id);
                res.json(Object.assign({}, conf.resp, {
                    data: trip,
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

        @httpPost("/insertOne",
            container.get<express.RequestHandler>("admin_auth"),
        )
        public async insertOne(@request() req: express.Request, @response() res: express.Response) {
            try {
                const trip = await this.cntr.insertTour(req.body);
                res.json(Object.assign({}, conf.resp, {
                    data: trip,
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

        @httpPost("/addLeader",
        container.get<express.RequestHandler>("admin_auth"),
        )
        public async AddLeader(@request() req: express.Request, @response() res: express.Response) {
            try {
                const trip = await this.cntr.addLeader(req.body);
                res.json(Object.assign({}, conf.resp, {
                    data: trip,
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
    }
    return TourApi;
}
