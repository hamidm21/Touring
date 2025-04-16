import { PgClient } from "../utils/pg/client";
import { Receipt} from "../entity";
const pg = new PgClient();

export function countAll(tourId: number) {
    return pg.db.getRepository(Receipt)
    .createQueryBuilder("receipt")
    .leftJoinAndSelect("receipt.tour", "tour")
    .where("tour.id = :id", {id: tourId})
    .getCount();
}

export function count(filter: object) {
    return pg.count(Receipt, filter);
}

export function sumPays() {
    return pg.db.getRepository(Receipt)
    .createQueryBuilder("receipt")
    .select("SUM(receipt.amount)", "sum")
    .getRawOne();
}

export function getAll(filter: object) {
    return pg.find(Receipt, filter);
}

export async function saveDebt(receipt: Receipt) {
    return pg.save(Receipt, receipt);
}

export async function getTotal(tourId: number) {
    // Get all credits for this tour
    const credit = await pg.db.getRepository(Receipt)
    .createQueryBuilder("receipt")
    .leftJoinAndSelect("receipt.tour", "tour")
    .select("SUM(receipt.amount)", "sum")
    .where("receipt.type='credit'")
    .andWhere("tour.id= :id", {id: tourId})
    .getRawOne();
    // Get all debts for this tour
    const debt = await pg.db.getRepository(Receipt)
    .createQueryBuilder("receipt")
    .leftJoinAndSelect("receipt.tour", "tour")
    .select("SUM(receipt.amount)", "sum")
    .where("receipt.type='debt'")
    .andWhere("tour.id= :id", {id: tourId})
    .getRawOne();
    // Return the result
    return Promise.resolve(credit.sum - debt.sum);
}

export async function getTourShare(tourId: number) {
    // Get all credits for this tour
    const credit = await pg.db.getRepository(Receipt)
    .createQueryBuilder("receipt")
    .leftJoinAndSelect("receipt.tour", "tour")
    .select("SUM(receipt.tourAmount)", "sum")
    .where("receipt.type='credit'")
    .andWhere("tour.id= :id", {id: tourId})
    .getRawOne();
    // Get all debts for this tour
    const debt = await pg.db.getRepository(Receipt)
    .createQueryBuilder("receipt")
    .leftJoinAndSelect("receipt.tour", "tour")
    .select("SUM(receipt.tourAmount)", "sum")
    .where("receipt.type='debt'")
    .andWhere("tour.id= :id", {id: tourId})
    .getRawOne();
    // Return the result
    return Promise.resolve(credit.sum - debt.sum);
}

export async function get3TourShare(tourId: number) {
    // Get all credits for this tour
    const credit = await pg.db.getRepository(Receipt)
    .createQueryBuilder("receipt")
    .leftJoinAndSelect("receipt.tour", "tour")
    .select("SUM(receipt.commissionAmount)", "sum")
    .where("receipt.type='credit'")
    .andWhere("tour.id= :id", {id: tourId})
    .getRawOne();
    // Get all debts for this tour
    const debt = await pg.db.getRepository(Receipt)
    .createQueryBuilder("receipt")
    .leftJoinAndSelect("receipt.tour", "tour")
    .select("SUM(receipt.commissionAmount)", "sum")
    .where("receipt.type='debt'")
    .andWhere("tour.id= :id", {id: tourId})
    .getRawOne();
    // Return the result
    return Promise.resolve(credit.sum - debt.sum);
}
