import e = require("express");
import * as helmet from "helmet";
import * as morgan from "morgan";
import * as bodyParser from "body-parser";

export const express = (app: e.Application) => {
    app.use(bodyParser.urlencoded({
        extended: true,
    }));
    app.use(bodyParser.json());
    app.use(helmet());
    app.use(morgan("dev"));
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
};
