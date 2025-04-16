import { inject, injectable } from "inversify";
import TYPES from "../utils/constant/type";
import { Payment, Receipt, ReceiptSource, ReceiptType, RegisteredUser } from "../entity";
import conf from "../utils/config";
import { Service } from "./service";
import { userService } from "../user";
import { tripService } from "../trip";
import * as zarin from "../utils/handler/pay";
import * as sms from "../utils/handler/sms";

@injectable()
export class Controller {
    constructor(
        @inject(TYPES.PayService) private service: Service,
        @inject(TYPES.UserService) private uService: userService,
        @inject(TYPES.TripService) private tService: tripService,
    ) {}

    /**
     * requestPayment
     */
    public requestPayment(info: any): Promise<any> {
        return new Promise<any>((res, rej) => {
            this.uService.getOne({id: info.creds.id}, {relations: ["trips", "payments"]}).then((user) => {
                this.tService.getOne(info.body.tripId, {relations: ["registers", "users", "payments", "tour"]})
                .then((trip) => {
                    if (!trip.free) {
                        const registers = JSON.parse(info.body.registers);
                        const registersCount = registers.length;
                        if (trip.capacity - trip.registered >= registersCount) {
                            const amount = trip.price * registersCount;
                            const users: RegisteredUser[] = registers;
                            zarin.paymentRequest(trip.price * registersCount,
                                conf.pay.callback, `${registers[0].fullName} برای ${trip.title} به تعداد ${registersCount}`,
                                null, registers[0].phoneNumber, (ans: any) => {
                                    if (ans.status === 100) {
                                        const payment = new Payment();
                                        payment.platform = info.body.platform;
                                        payment.amount = amount;
                                        payment.registeredCount = registersCount;
                                        payment.authority = ans.authority;
                                        payment.status = ans.status;
                                        payment.paymentURL = ans.url;
                                        payment.trip = trip;
                                        payment.tour = trip.tour;
                                        payment.user = user;
                                        payment.registers = users;
                                        this.service.requestPayment(payment).then((paid) => {
                                            res(paid);
                                        }).catch((e) => {
                                            rej(e);
                                        }).catch((e) => {
                                            rej(e);
                                        });
                                    } else {
                                        rej(ans);
                                    }
                            });
                        } else {
                            rej("more than capacity");
                        }
                    } else {
                        const registers = JSON.parse(info.body.registers);
                        const registersCount = registers.length;
                        if (trip.capacity - trip.registered >= registersCount) {
                            const refId = (new Date().getTime()).toString();
                            const returnTo = info.body.platform === "android" ? `http://3tourapp.ir/${true}` : "http://3tour.ir";
                            const url = `http://3tour.ir/paymentDone?refId=${refId}&tourName=${trip.tourName}&tripName=${trip.title}&amount=${ "مجانی" }&returnTo=${returnTo}&success=${true}`;
                            const users: RegisteredUser[] = registers;
                            const payment = new Payment();
                            payment.platform = info.body.platform;
                            payment.amount = 0;
                            payment.registeredCount = registersCount;
                            payment.authority = ("00000000000000000000000" + refId);
                            payment.status = 100;
                            payment.paymentURL = url;
                            payment.trip = trip;
                            payment.tour = trip.tour;
                            payment.user = user;
                            payment.registers = users;
                            payment.isPaid = true;
                            this.service.requestPayment(payment).then((pay) => {
                                trip.registered += registersCount;
                                users.forEach((register) => {
                                    trip.registers.push(register);
                                });
                                trip.payments.push(pay);
                                trip.users.push(user);
                                this.service.saveTrip(trip).then((_tripSaved) => {
                                    user.trips.push(trip);
                                    user.payments.push(pay);
                                    this.service.saveUser(user).then((_userSaved) => {
                                        res({
                                            paymentURL: pay.paymentURL,
                                        });
                                    }).catch((e) => {
                                        rej(e);
                                    });
                                }).catch((e) => {
                                    rej(e);
                                });
                            }).catch((e) => {
                                rej(e);
                            });
                        } else {
                            rej("more than capacity");
                        }
                    }
                }).catch((e) => {
                    rej(e);
                });
            }).catch((e) => {
                rej(e);
            });
        });
    }

    /**
     * requestUnAuthPayment
     */
    public requestUnAuthPayment(info: any): Promise<any> {
        return new Promise<any>((res, rej) => {
            this.tService.getOne(info.body.tripId, {relations: ["registers", "users", "payments", "tour"]})
            .then((trip) => {
                if (!trip.free) {
                    const registers = JSON.parse(info.body.registers);
                    const registersCount = registers.length;
                    if (trip.capacity - trip.registered >= registersCount) {
                        const amount = trip.price * registersCount;
                        const users: RegisteredUser[] = registers;
                        zarin.paymentRequest(trip.price * registersCount,
                            conf.pay.callback, `${registers[0].fullName} برای ${trip.title} به تعداد ${registersCount}`,
                            null, registers[0].phoneNumber, (ans: any) => {
                                if (ans.status === 100) {
                                    const payment = new Payment();
                                    payment.platform = info.body.platform;
                                    payment.amount = amount;
                                    payment.registeredCount = registersCount;
                                    payment.authority = ans.authority;
                                    payment.status = ans.status;
                                    payment.paymentURL = ans.url;
                                    payment.trip = trip;
                                    payment.tour = trip.tour;
                                    payment.registers = users;
                                    this.service.requestPayment(payment).then((paid) => {
                                        res(paid);
                                    }).catch((e) => {
                                        rej(e);
                                    }).catch((e) => {
                                        rej(e);
                                    });
                                } else {
                                    rej(ans);
                                }
                        });
                    } else {
                        rej("more than capacity");
                    }
                } else {
                    const registers = JSON.parse(info.body.registers);
                    const registersCount = registers.length;
                    if (trip.capacity - trip.registered >= registersCount) {
                        const refId = (new Date().getTime()).toString();
                        const returnTo = info.body.platform === "android" ? `http://3tourapp.ir/${true}` : "http://3tour.ir";
                        const url = `http://3tour.ir/paymentDone?refId=${refId}&tourName=${trip.tourName}&tripName=${trip.title}&amount=${ "مجانی" }&returnTo=${returnTo}&success=${true}`;
                        const users: RegisteredUser[] = registers;
                        const payment = new Payment();
                        payment.platform = info.body.platform;
                        payment.amount = 0;
                        payment.registeredCount = registersCount;
                        payment.authority = ("00000000000000000000000" + refId);
                        payment.status = 100;
                        payment.paymentURL = url;
                        payment.trip = trip;
                        payment.tour = trip.tour;
                        payment.registers = users;
                        payment.isPaid = true;
                        payment.refId = refId;
                        this.service.requestPayment(payment).then((pay) => {
                            trip.registered += registersCount;
                            users.forEach((register) => {
                                trip.registers.push(register);
                            });
                            trip.payments.push(pay);
                            this.service.saveTrip(trip).then(async (_tripSaved) => {
                                await sms.send(pay.registers[0].phoneNumber, "purchased",
                                `${pay.registeredCount}`, trip.title, pay.refId);
                                await sms.send("09169552212", "notify",
                                `${pay.registeredCount}`, trip.title);
                                res({
                                    paymentURL: pay.paymentURL,
                                });
                            }).catch((e) => {
                                rej(e);
                            });
                        }).catch((e) => {
                            rej(e);
                        });
                    } else {
                        rej("more than capacity");
                    }
                }
            }).catch((e) => {
                rej(e);
            });
        });
    }

    /**
     * paymentCheck
     */
    public paymentCheck(info: any): Promise<any> {
        return new Promise<any>((res, rej) => {
            const {
                Status,
                Authority,
            } = info;
            if (Status === "OK") {
                this.service.getOneByAuthority(Authority, {relations: ["registers", "trip", "user"]})
                .then((old: Payment) => {
                    if (old.refId === null) {
                        zarin.paymentVerification(old.amount, Authority, (ans: any) => {
                            this.tService.getOne(old.trip.id,
                                {relations: ["registers", "users", "payments", "tour"]}).then( async (trip) => {
                                if (old.user) {
                                    this.uService.getOne({id: old.user.id}, {relations: ["trips", "payments"]})
                                    .then(async (user) => {
                                        old.isPaid = true;
                                        old.refId = ans.toString();
                                        old.registers.forEach((register) => {
                                            trip.registers.push(register);
                                        });
                                        trip.registered += old.registeredCount;
                                        trip.users.push(user);
                                        trip.payments.push(old);
                                        user.trips.push(trip);
                                        user.payments.push(old);
                                        // save credit receipt
                                        const receipt = new Receipt();
                                        receipt.amount = old.amount;
                                        receipt.commissionAmount = ((trip.tour.commission / 100) * old.amount);
                                        receipt.commissionPercent = trip.tour.commission;
                                        receipt.payment = old;
                                        receipt.source = ReceiptSource.USER;
                                        receipt.type = ReceiptType.CREDIT;
                                        receipt.tourAmount = old.amount - receipt.commissionAmount;
                                        receipt.tour = trip.tour;
                                        receipt.user = user;
                                        receipt.trip = trip;
                                        await this.service.saveReceipt(receipt);
                                        await this.service.saveUser(user);
                                        await this.service.saveTrip(trip);
                                        await this.service.updateOne({id: old.id},
                                            {isPaid: true, refId: old.refId});
                                        await sms.send(user.phoneNumber, "purchased",
                                        `${old.registeredCount}`, trip.title, old.refId);
                                        await sms.send("09169552212", "notify",
                                        `${old.registeredCount}`, trip.title);
                                        res({
                                            amount: old.amount,
                                            refId: old.refId,
                                            return: old.platform === "android" ? `http://3tourapp.ir/${old.isPaid}` : "http://3tour.ir",
                                            success: old.isPaid,
                                            tourName: trip.tourName,
                                            tripName: trip.title,
                                        });
                                    });
                                } else {
                                    old.isPaid = true;
                                    old.refId = ans.toString();
                                    old.registers.forEach((register) => {
                                        trip.registers.push(register);
                                    });
                                    trip.registered += old.registeredCount;
                                    trip.payments.push(old);
                                    // save credit receipt
                                    const receipt = new Receipt();
                                    receipt.amount = old.amount;
                                    receipt.commissionAmount = ((trip.tour.commission / 100) * old.amount);
                                    receipt.commissionPercent = trip.tour.commission;
                                    receipt.payment = old;
                                    receipt.source = ReceiptSource.USER;
                                    receipt.type = ReceiptType.CREDIT;
                                    receipt.tourAmount = old.amount - receipt.commissionAmount;
                                    receipt.tour = trip.tour;
                                    receipt.trip = trip;
                                    await this.service.saveReceipt(receipt);
                                    await this.service.saveTrip(trip);
                                    await this.service.updateOne({id: old.id},
                                        {isPaid: true, refId: old.refId});
                                    await sms.send(old.registers[0].phoneNumber, "purchased",
                                    `${old.registeredCount}`, trip.title, old.refId);
                                    await sms.send("09169552212", "notify",
                                    `${old.registeredCount}`, trip.title);
                                    res({
                                        amount: old.amount,
                                        refId: old.refId,
                                        return: old.platform === "android" ? `http://3tourapp.ir/${old.isPaid}` : "http://3tour.ir",
                                        success: old.isPaid,
                                        tourName: trip.tourName,
                                        tripName: trip.title,
                                    });
                                }
                            });
                        });
                    } else {
                        rej("already paid");
                    }
                }).catch((e) => {
                    rej(e);
                });
            } else {
                this.service.getOneByAuthority(Authority, {relations: ["registers", "trip", "user"]})
                .then((old: Payment) => {
                    res({
                        amount: old.amount,
                        refId: parseInt(old.authority, 10),
                        return: old.platform === "android" ? `http://3tourapp.ir/${old.isPaid}` : "http://3tour.ir",
                        success: old.isPaid,
                        tourName: old.trip.tourName,
                        tripName: old.trip.title,
                    });
                });
            }
        });
    }
}
