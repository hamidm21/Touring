import { inject, injectable } from "inversify";
import TYPES from "../utils/constant/type";
import { Payment, Trip, User, Receipt, ReceiptSource, ReceiptType } from "../entity";
import { PgClient } from "../utils/pg/client";
// import { getConnection } from "typeorm";

@injectable()
export class Service {
    constructor(@inject(TYPES.PgClient) private db: PgClient) {}

    /**
     * getSuggested
     */
    public requestPayment(payment: Payment): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.db.save(Payment, payment).then((saved) => {
                resolve(saved);
            }).catch((e) => {
                reject(e);
            });
        });
    }

    /**
     * getOneByAuthority
     */
    public getOneByAuthority(authority: string, opt: any) {
        return new Promise<any>((resolve, reject) => {
            this.db.findOne(Payment, {authority}, opt).then((user) => {
                resolve(user);
            }).catch((e) => {
                reject(e);
            });
        });
    }

    /**
     * updateOne
     */
    public updateOne(filter: object, set: object) {
        return new Promise<Payment>((resolve, reject) => {
            this.db.update(Payment, filter, set).then((pay) => {
                resolve(pay);
            }).catch((e) => {
                reject(e);
            });
        });
    }

    /**
     * save
     */
    public saveTrip(filter: object): Promise<Trip> {
        return new Promise<Trip>((resolve, reject) => {
            this.db.save(Trip, filter).then((trip) => {
                resolve(trip);
            }).catch((e) => {
                reject(e);
            });
        });
    }

    /**
     * save
     */
    public saveUser(filter: object): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            this.db.save(User, filter).then((user) => {
                resolve(user);
            }).catch((e) => {
                reject(e);
            });
        });
    }

    /**
     * save
     */
    public saveReceipt(filter: object): Promise<Receipt> {
        return new Promise<Receipt>((resolve, reject) => {
            this.db.save(Receipt, filter).then((receipt) => {
                resolve(receipt);
            }).catch((e) => {
                reject(e);
            });
        });
    }

    /**
     * completeWithoutTransaction
     */
public completeWithoutTransaction(payment: Payment, trip: Trip, user: User): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        // update payment to be complete
        this.db.update(Payment, {id: payment.id}, {isPaid: true, refId: payment.refId}).then((_pay) => {
            this.db.save(Trip, trip).then((_trip) => {
                this.db.save(User, user).then((_user) => {
                    const receipt = new Receipt();
                    receipt.amount = payment.amount;
                    receipt.commissionAmount = ((trip.tour.commission / 100) * payment.amount);
                    receipt.commissionPercent = trip.tour.commission;
                    receipt.payment = payment;
                    receipt.source = ReceiptSource.USER;
                    receipt.type = ReceiptType.CREDIT;
                    receipt.tourAmount = payment.amount - receipt.commissionAmount;
                    receipt.tour = trip.tour;
                    receipt.user = user;
                    receipt.trip = trip;
                    this.db.save(Receipt, receipt).then(async (_receipt) => {
                        resolve(true);
                    }).catch((e) => {
                        reject(e);
                    });
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
}}

    /**
     * completePayment
     */
//     public completePayment(payment: any, trip: Trip, user: User, old: Payment) {
//         return new Promise<any>((resolve, reject) => {
//             const connection = getConnection();
//             const qr = connection.createQueryRunner();
//             // Connect to db
//             qr.connect().then((_conn) => {
//                 // start transaction
//                 qr.startTransaction().then((_st) => {
//                     // update payment to be complete
//      qr.manager.update(Payment, {id: payment.id}, {isPaid: true, refId: payment.refId}).then((_pay) => {
//                         qr.manager.findOne(Payment, {id: payment.id}).then((pays) => {
//                             // update trip to show the new registered count
//                             qr.manager.save(Trip, trip).then((_trip) => {
//                                 // update user to have the history for payment
//                                 qr.manager.save(User, user).then((_user) => {
//                                     // save credit receipt
//                                     const receipt = new Receipt();
//                                     receipt.amount = old.amount;
//                                     receipt.commissionAmount = ((trip.tour.commission / 100) * old.amount);
//                                     receipt.commissionPercent = trip.tour.commission;
//                                     receipt.payment = old;
//                                     receipt.source = ReceiptSource.USER;
//                                     receipt.type = ReceiptType.CREDIT;
//                                     receipt.tourAmount = old.amount - receipt.commissionAmount;
//                                     receipt.tour = trip.tour;
//                                     receipt.user = user;
//                                     receipt.trip = trip;
//                                     qr.manager.save(Receipt, receipt).then(async (_receipt) => {
//                                         // commit transaction with no problem.
//                                         qr.commitTransaction().then(async (_tra) => {
//                                             qr.release().then((_resp) => {
//                                                 resolve(true);
//                                             }).catch(async (e) => {
//                                                 await qr.rollbackTransaction();
//                                                 await qr.release();
//                                                 reject(e);
//                                             });
//                                         }).catch(async (e) => {
//                                             await qr.rollbackTransaction();
//                                             await qr.release();
//                                             reject(e);
//                                         });
//                                     }).catch(async (e) => {
//                                         await qr.rollbackTransaction();
//                                         await qr.release();
//                                         reject(e);
//                                     });
//                                 }).catch(async (e) => {
//                                     await qr.rollbackTransaction();
//                                     await qr.release();
//                                     reject(e);
//                                 });
//                             }).catch(async (e) => {
//                                 await qr.rollbackTransaction();
//                                 await qr.release();
//                                 reject(e);
//                             });
//                         });
//                     }).catch(async (e) => {
//                         await qr.rollbackTransaction();
//                         await qr.release();
//                         reject(e);
//                     });
//                 }).catch(async (e) => {
//                     await qr.rollbackTransaction();
//                     await qr.release();
//                     reject(e);
//                 });
//             }).catch(async (e) => {
//                 await qr.rollbackTransaction();
//                 await qr.release();
//                 reject(e);
//             });
//         });
//     }
