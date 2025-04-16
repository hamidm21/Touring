import express from "express";
import { GetAll, getFinance, PayRequest } from ".";
import { headerCount } from "../dashboard/route";
const router = express.Router();

router.get("/",
    async (req: any, res: express.Response, _next: express.NextFunction) => {
        const ans = await GetAll(req.query.page || 1, req.user.agency.id);
        const header = await headerCount(req.user.agency.id);
        res.render("pages/finances", {
            header,
            list: {
                page: req.query.page || 1,
                pages: ans.pages,
                pays: ans.receipts,
            },
            nav: {
                fullName: req.user.fullName,
            },
        });
});

router.get("/request",
    async (req: any, res: express.Response, _next: express.NextFunction) => {
    const header = await headerCount(req.user.agency.id);
    const finance = await getFinance(req.user.agency.id);
    res.render("pages/requestPay", {
        finance,
        header,
        nav: {
            fullName: req.user.fullName,
        },
    });
});

router.post("/request",
    async (req: any, res: express.Response, _next: express.NextFunction) => {
        const header = await headerCount(req.user.agency.id);
        const finance = await getFinance(req.user.agency.id);
        if (req.body.checkout <= finance.tour) {
                await PayRequest(req.user, req.body);
                res.redirect("/finances?page=1");
        } else {
            res.locals.errors = "مبلغ وارد شده بیشتر از حد مجاز است";
            res.render("pages/requestPay", {
                finance,
                header,
                nav: {
                    fullName: req.user.fullName,
                },
            });
        }
});

export { router };
