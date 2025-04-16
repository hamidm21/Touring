import express from "express";
import { GetAll, GetOne, InsertTrip, UpdateOne, ArchiveOne, GetUsers } from ".";
import multer from "multer";
import path from "path";
import filter from "../utils/middleware/multer";
import { headerCount } from "../dashboard/route";

const storage = multer.diskStorage({
    destination(_req: any, _file: any, cb: any) {
        cb(null, path.join(__dirname, "../public/img/uploads"));
    },
    filename(_req: any, file: any, cb: any) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({storage, fileFilter: filter});
const router = express.Router();

router.get("/",
    async (req: any, res: express.Response, _next: express.NextFunction) => {
    const header = await headerCount(req.user.agency.id);
    const ans = await GetAll(req.query.page || 1, req.user.agency.id);
    res.render("pages/trips", {
        header,
        list: {
            page: req.query.page || 1,
            pages: ans.pages,
            trips: ans.trips,
        },
        nav: {
            fullName: req.user.fullName,
        },
    });
});

router.get("/create",
    async (req: any, res: express.Response, _next: express.NextFunction) => {
    const header = await headerCount(req.user.agency.id);
    res.render("pages/createTrip", {
        header,
        nav: {
            fullName: req.user.fullName,
        },
    });
});

// TODO: implement dataPicker check.
// TODO: implmemnt small desc bottom of images.
router.post("/create", upload.array("images", 6),
    async (req: any, res: express.Response, _next: express.NextFunction) => {
        try {
            await InsertTrip({body: req.body, files: req.files, leader: req.user});
            res.redirect("/trips?page=1");
        } catch (error) {
            res.status(400).json(Object.assign({}, req.base, {
                data: error.data,
                message: error.message,
                result: false,
            }));
        }
});

router.get("/edit/:id",
    async (req: any, res: express.Response, _next: express.NextFunction) => {
    const header = await headerCount(req.user.agency.id);
    const trip = await GetOne(req.params.id);
    res.render("pages/editTrip", {
        header,
        nav: {
            fullName: req.user.fullName,
        },
        trip,
    });
});

router.post("/edit/:id", upload.array("images", 6),
    async (req: any, res: express.Response, _next: express.NextFunction) => {
    try {
        await UpdateOne({body: req.body, files: req.files, leader: req.user, id: req.params.id});
        res.redirect("/trips?page=1");
    } catch (e) {
        res.status(400).json(Object.assign({}, req.base, {
            data: e.data,
            message: e.message,
            result: false,
        }));
    }
});

router.get("/archive/:id",
    async (req: any, res: express.Response, _next: express.NextFunction) => {
    await ArchiveOne(req.params.id);
    res.redirect("/trips?page=1");
});

router.get("/:slug/users",
    async (req: any, res: express.Response, _next: express.NextFunction) => {
    const registers = await GetUsers(req.query.page || 1, req.params.slug);
    const header = await headerCount(req.user.agency.id);
    res.render("pages/registers", {
        header,
        nav: {
            fullName: req.user.fullName,
        },
        page: req.query.page || 1,
        pages: registers.pages,
        registers: registers.registers,
        title: registers.title,
    });
});

export { router };
