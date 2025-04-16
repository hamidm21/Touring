import { PrimaryGeneratedColumn, Column, Entity, CreateDateColumn,
    UpdateDateColumn, ManyToOne, OneToMany, OneToOne, JoinColumn } from "typeorm";
import {Trip, User, RegisteredUser, Tour} from ".";

export enum Platform {
    WEB = "web",
    ANDROID = "android",
}

@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public authority: string;

    @Column({
        nullable: true,
    })
    public refId: string;

    @Column({
        default: Platform.WEB,
        enum: Platform,
        type: "enum",
    })
    public platform: Platform;

    @Column({
        default: 1,
    })
    public registeredCount: number;

    @Column()
    public amount: number;

    @Column()
    public status: number;

    @Column()
    public paymentURL: string;

    @Column({
        default: false,
    })
    public isPaid: boolean;

    @Column({
        default: false,
    })
    public free: boolean;

    @OneToMany((_type) => RegisteredUser, (registers) => registers.payment, {cascade: true})
    public registers: RegisteredUser[];

    @ManyToOne((_type) => Trip, (trip) => trip.payments)
    public trip: Trip;

    @ManyToOne((_type) => Tour, (tour) => tour.payments)
    public tour: Tour;

    @ManyToOne((_type) => User, (user) => user.payments)
    public user: User;

    @OneToOne((_type)  => Receipt, (receipt) => receipt.payment)
    public receipt: Receipt;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;
}

export enum ReceiptType {
    DEBT = "debt",
    CREDIT = "credit",
}

export enum ReceiptSource {
    USER = "user",
    LEADER = "leader",
}

// tslint:disable-next-line: max-classes-per-file
@Entity()
export class Receipt {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public amount: number;

    @Column()
    public commissionPercent: number;

    @Column()
    public commissionAmount: number;

    @Column()
    public tourAmount: number;

    @Column({
        nullable: true,
    })
    public description: string;

    @Column({
        default: ReceiptType.CREDIT,
        enum: ReceiptType,
        type: "enum",
    })
    public type: ReceiptType;

    @Column({
        default: ReceiptSource.USER,
        enum: ReceiptSource,
        type: "enum",
    })
    public source: ReceiptSource;

    @ManyToOne((_type) => Tour, (tour) => tour.receipts)
    public tour: Tour;

    @OneToOne((_type) => Payment, (payment) => payment.receipt)
    @JoinColumn()
    public payment: Payment;

    @ManyToOne((_type) => User, (user) => user.receipts)
    public user: User;

    @ManyToOne((_type) => Trip, (trip) => trip.receipts)
    public trip: Trip;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;
}
