import { inject, injectable } from "inversify";
import TYPES from "../utils/constant/type";
import { User, Contact } from "../entity";
import { Service } from "./service";
import * as jwt from "jsonwebtoken";
import conf from "../utils/config";
import * as bcrypt from "bcryptjs";
import * as sms from "../utils/handler/sms";
import { RestError } from "../utils/constant/errors";

@injectable()
export class Controller {
    constructor(@inject(TYPES.UserService) private service: Service) { }

    /**
     * getUsers
     */
    public getUsers(): Promise<User[]> {
        return this.service.getAll({});
    }

    /**
     * insertWithRole
     */
    public insertWithRole(user: User) {
        return new Promise<any>(async (res, rej) => {
            const admin = new User();
            admin.fullName = user.fullName;
            admin.mid = user.mid;
            admin.password = await Controller.genHash(user.password);
            admin.phoneNumber = user.phoneNumber;
            admin.role = user.role;
            admin.validated = true;
            this.service.insertOne(admin).then((saved) => {
                res(saved);
            }).catch((e) => {
                rej(e);
            });
        });
    }

    public changePassword(user: User) {
        return new Promise<any>(async (res, rej) => {
            const newPass = await Controller.genHash(user.password);
            this.service.updateOne({phoneNumber: user.phoneNumber}, {password: newPass}).then((newUser) => {
                res(newUser);
            }).catch((e) => {
                rej(e);
            });
        });
    }

    /**
     * register //TODO: should be done by transaction to avoid useless users.
     */
    public async register(user: User): Promise<any> {
        return new Promise<any>((res, rej) => {
            this.service.getOne({phoneNumber: user.phoneNumber}).then(async (exists) => {
                if (exists) {
                    rej({
                        code: RestError.ALLREADY_EXISTS,
                        message: "already exists",
                    });
                }
                const newUser = new User();
                newUser.phoneNumber = user.phoneNumber;
                newUser.mid = user.mid;
                newUser.fullName = user.fullName;
                newUser.password = await Controller.genHash(user.password);
                this.service.insertOne(newUser).then(async (saved) => {
                    if (saved) {
                        const vCode = Math.floor(Math.random() * 90000) + 10000;
                        sms.verification(saved.phoneNumber, "verify", vCode).then((sent: any) => {
                            if (sent) {
                                this.service.updateOne({phoneNumber: saved.phoneNumber}, {vCode}).then((_updated) => {
                                    res("user is saved");
                                }).catch((e) => {
                                    rej(e);
                                });
                            } else {
                                rej("problem while sending sms");
                            }
                        }).catch((e: any) => {
                            rej(e);
                        });
                    } else {
                        rej("somthing went wrong");
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
     * sendValidation
     */
    public async sendValidation(phoneNumber: string): Promise<boolean> {
        return new Promise<boolean>(async (res, rej) => {
            const vCode = Math.floor(Math.random() * 90000) + 10000;
            this.service.updateOne({phoneNumber}, {vCode}).then((_updated) => {
                sms.verification(phoneNumber, "verify", vCode).then((sent) => {
                    if (sent) {
                        res(true);
                    } else {
                        rej(false);
                    }
                }).catch((e) => {
                    rej(e);
                });
            });
        });
    }

    /**
     * checkValidation TODO: it should check if the vCode was generated less than two minutes ago
     */
    public async checkValidation(user: User): Promise<boolean> {
        return new Promise<boolean>((res, rej) => {
            this.service.getOne({phoneNumber: user.phoneNumber, vCode: user.vCode}).then((found) => {
                if (found) {
                    this.service.updateOne({phoneNumber: found.phoneNumber}, {validated: true}).then((updated) => {
                        if (updated) {
                            res(true);
                        } else {
                            res(false);
                        }
                    }).catch((e) => {
                        rej(e);
                    });
                } else {
                    rej(false);
                }
            }).catch((_e) => {
                rej({
                    code: RestError.WRONG_CODE,
                    message: "wrong code",
                });
            });
        });
    }

    /**
     * login
     */
    public login(user: User): Promise<any> {
        return new Promise<any>(async (res, rej) => {
            this.service.getOne({phoneNumber: user.phoneNumber}).then((found) => {
                if (found) {
                    if (found.validated) {
                        bcrypt.compare(user.password, found.password).then((match) => {
                            if (match) {
                                const payload = {
                                    date: new Date(),
                                    id: found.id,
                                    name: user.fullName,
                                    role: found.role,
                                };
                                const accessToken = jwt.sign({
                                    payload,
                                },
                                conf.JWT.secret || "secret",
                                {
                                    expiresIn: conf.JWT.exp || "1h",
                                });
                                if (found.refreshToken) {
                                    res({
                                        accessToken,
                                        payload: {
                                            fullName: found.fullName,
                                            mid: found.mid,
                                        },
                                        refreshToken: found.refreshToken,
                                    });
                                } else {
                                    const refreshToken = jwt.sign({
                                        payload,
                                    }, conf.JWT.secret || "refresh_secret");
                                    this.service.updateOne({id: found.id}, {refreshToken}).then((_updated) => {
                                        res({
                                            accessToken,
                                            payload: {
                                                fullName: found.fullName,
                                                mid: found.mid,
                                            },
                                            refreshToken,
                                        });
                                    });
                                }
                            } else {
                                rej({
                                    code: RestError.WRONG_PASSWORD,
                                    message: "wrong password",
                                });
                            }
                        }).catch((e) => {
                            rej(e);
                        });
                    } else {
                        this.sendValidation(found.phoneNumber).then((_sent) => {
                            rej({
                                code: RestError.NOT_VALIDATED,
                                message: "not validated",
                            });
                        });
                    }
                } else {
                    rej({
                        code: RestError.NOT_FOUND,
                        message: "not found",
                    });
                }
            }).catch((e) => {
                rej(e);
            });
        });
    }

    /**
     * refreshToken
     */
    public refreshToken(refreshToken: string): Promise<string> {
        return new Promise<any>(async (res, rej) => {
            this.service.getOne({refreshToken}).then((found) => {
                if (found) {
                    res(jwt.sign({
                        date: new Date(),
                        id: found.id,
                        name: found.fullName,
                    },
                    conf.JWT.secret || "secret",
                    {
                        expiresIn: conf.JWT.exp || "1d",
                    }));
                } else {
                    rej("not found");
                }
           }).catch((e) => {
               rej(e);
           });
        });
    }

    /**
     * getHistory
     */
    public getHistory(creds: any): Promise<any> {
        return new Promise<any>((res, rej) => {
            this.service.getOne({id: creds.id}, {relations: ["payments", "payments.trip"]}).then((found) => {
                if (found) {
                    res(found);
                } else {
                    rej("not found");
                }
            });
        });
    }

    /**
     * contactUs
     */
    public contactUs(filter: Contact) {
        return this.service.insertContact(filter);
    }

    /**
     * generates a hash from password
     */
    public static async genHash(data: string) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(data, salt);
    }
}
