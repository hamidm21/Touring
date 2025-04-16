import "reflect-metadata";
import "./utils/config";
import "./user/api.express";
import "./payment/api.express";
import "./trip/api.express";
import "./tour/api.express";
import * as express from "express";
import * as debug from "debug";
import { Container } from "inversify";
import { express as middleware} from "./utils/middleware/express";
import { user as user_auth, admin as admin_auth } from "./utils/middleware/auth";
import { InversifyExpressServer } from "inversify-express-utils";
import { makeLoggerMiddleware } from "inversify-logger-middleware";
import TYPES from "./utils/constant/type";
import { tripController, tripService } from "./trip";
import { userController, userService, userFactory} from "./user";
import { tourController, tourService, tourFactory } from "./tour";
import { payController, payService, payFactory} from "./payment";
import { PgClient } from "./utils/pg/client";
import log from "./utils/logger";

// Log Container For Development
const container = new Container();
if (process.env.NODE_ENV === "dev") {
    const logger = makeLoggerMiddleware();
    container.applyMiddleware(logger);
}

// Making Container
container.bind<express.RequestHandler>("user_auth").toConstantValue(user_auth);
container.bind<express.RequestHandler>("admin_auth").toConstantValue(admin_auth);
container.bind<PgClient>(TYPES.PgClient).to(PgClient);
container.bind<tourService>(TYPES.TourService).to(tourService);
container.bind<tourController>(TYPES.TourController).to(tourController);
container.bind<tripService>(TYPES.TripService).to(tripService);
container.bind<tripController>(TYPES.TripController).to(tripController);
container.bind<userService>(TYPES.UserService).to(userService);
container.bind<userController>(TYPES.UserController).to(userController);
container.bind<payService>(TYPES.PayService).to(payService);
container.bind<payController>(TYPES.PayController).to(payController);

// Passing container for middleware usage
userFactory(container);
payFactory(container);
tourFactory(container);

// Creating server on container
const server = new InversifyExpressServer(container);

// Adding Midllwares
const port: string = process.env.PORT || "3000";

server
    .setConfig(middleware)
    .build()
    .listen(port);
log.warn("ok");
debug("tourche.http")(`Server running on port ${port}`);
