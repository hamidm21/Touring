import { countAll, getAll, count, getTotal, getTourShare, get3TourShare, saveDebt } from "./dal";
import { User, Receipt, ReceiptSource, ReceiptType } from "../entity";
import { send } from "../utils/handler/sms";

export function CountAll(tourId: number): Promise<any> {
    return countAll(tourId);
}

export function getIncome(tourId: number): Promise<any> {
    return getTotal(tourId);
}

export async function GetAll(page: number, tourId: number): Promise<any> {
    const receipts = await getAll({
        order: {id: "DESC"},
        relations: ["payment", "user", "trip", "trip.registers"],
        skip: (page - 1) * 10, take: 10,
        where: {tour: {id: tourId},
        },
    });
    const totalCount = await count({
        relations: ["payment", "user", "trip"],
        skip: (page - 1) * 10, take: 10,
        where: {tour: {id: tourId},
        },
    });
    return Promise.resolve({receipts, pages: Math.ceil( totalCount / 10)});
}

export async function getFinance(tourId: number): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        getTotal(tourId).then((total) => {
            getTourShare(tourId).then((tour) => {
                get3TourShare(tourId).then((setour) => {
                    resolve({total, tour, setour});
                }).catch((e) => {
                    reject(e);
                });
            }).catch((e) => {
                reject(e);
            });
        }).catch((e) => {
            reject(e);
        });
    });
}

export async function PayRequest(user: User, filter: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        const total = Math.floor((filter.checkout * 100) / 95);
        const receipt = new Receipt();
        receipt.amount = total;
        receipt.commissionAmount = Math.floor(((user.tour.commission / 100) * total));
        receipt.commissionPercent = user.tour.commission;
        receipt.source = ReceiptSource.LEADER;
        receipt.type = ReceiptType.DEBT;
        receipt.tourAmount = total - receipt.commissionAmount;
        receipt.tour = user.tour;
        receipt.user = user;
        receipt.description = filter.extra;
        saveDebt(receipt).then((_debt) => {
            send("09166599516", user.fullName).then((_sent) => {
                resolve(true);
            }).catch((e) => {
                reject(e);
            });
        }).catch((e) => {
            reject(e);
        });
    });
}
