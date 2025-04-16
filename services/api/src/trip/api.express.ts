import { inject } from "inversify";
import TYPES from "../utils/constant/type";
import { Controller } from "./controller";
import * as express from "express";
import conf from "../utils/config";
import { controller, request, response, httpPost } from "inversify-express-utils";
import logger from "../utils/logger";

@controller("/trips")
export class TripApi {
    constructor(@inject(TYPES.TripController) private cntr: Controller) { }

    @httpPost("/getSlider")
    public async getSlider(@request() _req: express.Request, @response() res: express.Response) {
        try {
            const trips = await this.cntr.getSlider();
            res.json(Object.assign({}, conf.resp, {
                data: {trips},
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

    @httpPost("/getSuggested")
    public async getSuggested(@request() req: express.Request, @response() res: express.Response) {
        try {
            const answer = await this.cntr.getSuggested(req.body);
            res.json(Object.assign({}, conf.resp, {
                data: {trips: answer.trips, totalCount: answer.count},
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

    @httpPost("/getPopular")
    public async getPopular(@request() req: express.Request, @response() res: express.Response) {
        try {
            const answer = await this.cntr.getPopular(req.body);
            res.json(Object.assign({}, conf.resp, {
                data: {trips: answer.trips, totalCount: answer.count},
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

    @httpPost("/getRecent")
    public async getRecent(@request() req: express.Request, @response() res: express.Response) {
        try {
            const answer = await this.cntr.getRecent(req.body);
            res.json(Object.assign({}, conf.resp, {
                data: {trips: answer.trips, totalCount: answer.count},
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
                data: {trip},
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

    @httpPost("/getOneBySlug")
    public async getOneBySlug(@request() req: express.Request, @response() res: express.Response) {
        try {
            const trip = await this.cntr.getOneBySlug(req.body.slug);
            res.json(Object.assign({}, conf.resp, {
                data: {trip},
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

    @httpPost("/search")
    public async search(@request() req: express.Request, @response() res: express.Response) {
        try {
            const answer = await this.cntr.search(req.body);
            res.json(Object.assign({}, conf.resp, {
                data: {trips: answer.trips, totalCount: answer.count},
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
