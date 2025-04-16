import express from "express";
import { CountAll as countPays, getIncome, GetAll as getAllReceipts } from "../finance";
import { CountAll as countTrips, GetAll as getAllTrips } from "../trip";
import { CountAll as countUsers, getAll as getAllUsers } from "../user";
const router = express.Router();

router.get("/",
    async (req: any, res: express.Response, _next: express.NextFunction) => {
    const header = await headerCount(req.user.agency.id);
    const usersAns = await getAllUsers(1, req.user.agency.id);
    const tripsAns = await getAllTrips(req.query.page || 1, req.user.agency.id);
    const receiptsAns = await getAllReceipts(1, req.user.agency.id);
    res.render("pages/dashboard", {
        header,
        nav: {
        fullName: req.user.fullName,
        },
        tables: {
            receipts: receiptsAns.receipts,
            trips: tripsAns.trips,
            users: usersAns.users,
        },
    });
});

router.post("/salesChart",
    async (req: any, res: express.Response, _next: express.NextFunction) => {
    // const userCount = await countUsers();
    // const income = await getIncome();
    // const tripCount = await CountAll();
    res.render("pages/dashboard", {
        header: {
            userCount: 60,
        },
        nav: {
        fullName: req.user.fullName,
    },
    });
});

async function headerCount(tourId: number) {
    const users = await countUsers(tourId);
    const purchases = await countPays(tourId);
    const income = await getIncome(tourId);
    const trips = await countTrips(tourId);
    // tslint:disable-next-line: max-line-length
    return Promise.resolve({ income: `${income} تومان`, trips, purchases: `${purchases}`, users: `${users} نفر`});
}

export { router, headerCount };
