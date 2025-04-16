import express from "express";
import { getAll } from ".";
import { headerCount } from "../dashboard/route";
const router = express.Router();

router.get("/",
    async (req: any, res: express.Response, _next: express.NextFunction) => {
        const ans = await getAll(req.query.page || 1, req.user.agency.id);
        const header = await headerCount(req.user.agency.id);
        res.render("pages/users", {
            header,
            list: {
                page: req.query.page || 1,
                pages: ans.pages,
                users: ans.users,
            },
            nav: {
                fullName: req.user.fullName,
            },
        });
});

export { router };
