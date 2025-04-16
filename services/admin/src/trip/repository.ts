import { getAll, insertTrip, getOne, updateOne, count, findOne } from "./dal";
import { Trip } from "../entity";
import jmoment from "moment-jalaali";
import logger from "../utils/logger";
jmoment.loadPersian({dialect: "persian-modern"});

export function CountAll(tourId: number): Promise<any> {
    return count({relations: ["tour"], where: {tour: {id: tourId}}});
}

export async function GetAll(page: number, tourId?: number): Promise<any> {
    // tslint:disable-next-line: object-literal-sort-keys
    const trips = await getAll({relations: ["tour"], take: 10, skip: (page - 1) * 10, where: {tour: {id: tourId}},
    order: {openingDate: "DESC"}});
    const totalCount = await count({relations: ["tour"], where: {tour: {id: tourId}}});
    return Promise.resolve({trips, pages: Math.ceil(totalCount / 10)});
}

export function GetOne(id: number): Promise<any> {
    return getOne(id);
}

export function InsertTrip(filter: any): Promise<any> {
    return new Promise<any>( async (res, _rej) => {
        const trip = new Trip();
        trip.images = filter.files.map((x: any) => "http://leader.3tour.ir/img/uploads/" + x.filename);
        trip.imgURL = "http://leader.3tour.ir/img/uploads/" + filter.files[0].filename;
        trip.bannerURL = "http://leader.3tour.ir/img/uploads/" + filter.files[0].filename;
        trip.leader = filter.body.leader;
        trip.description = filter.body.desc;
        trip.openingDate = new Date(parseInt(filter.body.openingTime, 10));
        trip.closingDate = new Date(parseInt(filter.body.closingTime, 10));
        trip.prOpeningDate = jmoment(new Date(parseInt(filter.body.openingTime, 10)).toLocaleString("en-US", {timeZone: "Iran"})).format("LL");
        trip.prClosingDate = jmoment(new Date(parseInt(filter.body.closingTime, 10)).toLocaleString("en-US", {timeZone: "Iran"})).format("LL");
        trip.capacity = filter.body.capacity;
        trip.origin = filter.body.origin;
        trip.destination = filter.body.dest;
        trip.price = filter.body.price.length !== 0 && !filter.body.free ? filter.body.price : 0;
        trip.slug = (`${filter.leader.agency.name} ${filter.body.title} ${jmoment(new Date(parseInt(filter.body.closingTime, 10)).toLocaleString("en-US", {timeZone: "Iran"})).format("LL")}`).split(" ").join("-");
        trip.text = filter.body.text;
        trip.title = filter.body.title;
        trip.tourName = filter.leader.agency.name;
        trip.leader = filter.leader;
        trip.leaderName = filter.leader.fullName;
        trip.tour = filter.leader.agency;
        trip.free = filter.body.free ? true : false;
        trip.contactInfo = {
            email: "",
            phoneNumber: filter.leader.phoneNumber,
        },
        trip.dataTable = {
            closingDate: await genPrDate(new Date(parseInt(filter.body.closingTime, 10))),
            destination: filter.body.dest,
            distance: filter.body.distance,
            duration: `${Math.ceil( Math.abs(filter.body.closingTime - filter.body.openingTime) / (1000 * 60 * 60 * 24))} روز `,
            extra: filter.body.extra,
            leader: filter.leader.fullName,
            openingDate: await genPrDate(new Date(parseInt(filter.body.openingTime, 10))),
            origin: filter.body.origin,
            required: filter.body.required,
            services: filter.body.services,
            vehicle: filter.body.vehicle,
        },
        trip.webAddr = "http://3tour.ir/trip/" + trip.slug;
        res(await insertTrip(trip));
    });
}

export function UpdateOne(filter: any): Promise<any> {
    return new Promise<any>( async (res, _rej) => {
        const trip = new Trip();
        filter.files.length !== 0 ? trip.images = filter.files.map((x: any) =>
        "http://leader.3tour.ir/img/uploads/" + x.filename) : trip.leader = filter.body.leader;
        filter.files.length !== 0 ? trip.imgURL = "http://leader.3tour.ir/img/uploads/" + filter.files[0].filename :
        trip.leader = filter.body.leader;
        filter.files.length !== 0 ? trip.bannerURL = "http://leader.3tour.ir/img/uploads/" + filter.files[0].filename :
        trip.leader = filter.body.leader;
        trip.leader = filter.body.leader;
        trip.description = filter.body.desc;
        trip.openingDate = new Date(parseInt(filter.body.openingTime, 10));
        trip.closingDate = new Date(parseInt(filter.body.closingTime, 10));
        trip.prOpeningDate = jmoment(new Date(parseInt(filter.body.openingTime, 10)).toLocaleString("en-US", {timeZone: "Iran"})).format("LL");
        trip.prClosingDate = jmoment(new Date(parseInt(filter.body.closingTime, 10)).toLocaleString("en-US", {timeZone: "Iran"})).format("LL");
        trip.capacity = filter.body.capacity;
        trip.origin = filter.body.origin;
        trip.destination = filter.body.dest;
        trip.price = filter.body.price.length !== 0 && !filter.body.free ? filter.body.price : 0;
        trip.slug = (`${filter.leader.agency.name} ${filter.body.title} ${jmoment(new Date(parseInt(filter.body.closingTime, 10)).toLocaleString("en-US", {timeZone: "Iran"})).format("LL")}`).split(" ").join("-");
        trip.text = filter.body.text;
        trip.title = filter.body.title;
        trip.tourName = filter.leader.agency.name;
        trip.leader = filter.leader;
        trip.leaderName = filter.leader.fullName;
        trip.tour = filter.leader.agency;
        trip.free = filter.body.free ? true : false;
        trip.contactInfo = {
            email: "",
            phoneNumber: filter.leader.phoneNumber,
        },
        trip.dataTable = {
            closingDate: await genPrDate(new Date(parseInt(filter.body.closingTime, 10))),
            destination: filter.body.dest,
            distance: filter.body.distance,
            duration: `${Math.ceil( Math.abs(filter.body.closingTime - filter.body.openingTime) / (1000 * 60 * 60 * 24))} روز `,
            extra: filter.body.extra,
            leader: filter.leader.fullName,
            openingDate: await genPrDate(new Date(parseInt(filter.body.openingTime, 10))),
            origin: filter.body.origin,
            required: filter.body.required,
            services: filter.body.services,
            vehicle: filter.body.vehicle,
        },
        trip.webAddr = "http://3tour.ir/trip/" + trip.slug;
        logger.debug({trip});
        res(await updateOne({id: filter.id}, trip));
    });
}

export function ArchiveOne(id: number): Promise<boolean> {
    return new Promise<boolean>(async (res, rej) => {
        const trip = await getOne(id);
        if (trip.registered === trip.capacity) {
            res(true);
        } else {
            updateOne({id}, {archived: !trip.archived}).then((_updated) => {
                res(true);
            }).catch((e) => {
                rej(e);
            });
        }
    });
}

export function GetUsers(page: number, slug: string): Promise<any> {
    return new Promise<any>((res, rej) => {
        findOne({slug}, {relations: ["registers"]}).then((trip) => {
            const end = page * 10;
            const registers = trip.registers.slice(end - 10, end);
            const totalCount = trip.registers.length;
            res({pages: Math.ceil(totalCount / 10), registers, title: trip.title});
        }).catch((e) => {
            rej(e);
        });
    });
}

function genPrDate(date: Date): Promise<string> {
    return new Promise<string>((res, rej) => {
        try {
            const day = date.getDay();
            const prDay = day === 0 ? "یکشنبه" : day === 1 ? "دوشنبه" : day === 2 ? "سه شنبه" :
            day === 3 ? "چهارشنبه" : day === 4 ? "پنجشنبه" : day === 5 ? "جمعه" : day === 6 ? "شنبه" : "";
            const prDate = jmoment(new Date(date.getTime()).toLocaleString("en-US", {timeZone: "Iran"})).format("LL");
            const hour = new Date(date.toLocaleString("en-US", {timeZone: "Iran"})).getHours();
            const min = new Date(date.toLocaleString("en-US", {timeZone: "Iran"})).getMinutes();
            min === 0 ? res(`${prDay} ${prDate} رأس ساعت ${hour}`) : res(`${prDay} ${prDate} ساعت ${hour} و ${min} دقیقه`);
        } catch (e) {
            rej(e);
        }
    });
}
