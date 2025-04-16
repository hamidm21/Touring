import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
    UpdateDateColumn, OneToMany, ManyToMany, ManyToOne, JoinTable, OneToOne} from "typeorm";
import { Payment, Trip, Tour, Receipt } from ".";

export enum Role {
    ADMIN = "admin",
    LEADER = "leader",
    USER = "user",
}

@Entity()
export class Users {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({
        nullable: false,
    })
    public fullName: string;

    @Column({
        nullable: false,
        unique: true,
    })
    public phoneNumber: string;

    @Column({
        nullable: false,
        type: "bigint",
        unique: true,
    })
    public mid: number;

    @Column({
        default: false,
    })
    public validated: boolean;

    @Column({
        nullable: true,
    })
    public vCode: number;

    @Column({
        default: Role.USER,
        enum: Role,
        type: "enum",
    })
    public role: Role;

    @OneToOne((_type) => Tour, (tour) => tour.leader)
    public tour: Tour;

    @ManyToOne((_type) => Tour, (tour) => tour.leaders)
    public agency: Tour;

    @Column()
    public password: string;

    @Column({
        nullable: true,
    })
    public refreshToken: string;

    @Column({
        nullable: true,
        type: "bigint",
        unique: true,
    })
    public creditId: number;

    @Column({
        nullable: true,
        unique: true,
    })
    public shabaId: string;

    @OneToMany((_type) => Payment, (payment) => payment.user)
    public payments: Payment[];

    @OneToMany((_type) => Receipt, (receipt) => receipt.user)
    public receipts: Receipt[];

    @OneToMany((_type) => Trip, (trip) => trip.leader)
    public leadTrips: Trip[];

    @ManyToMany((_type) => Trip, (trip) => trip.users)
    @JoinTable()
    public trips: Trip[];

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;
}

// tslint:disable-next-line: max-classes-per-file
@Entity()
export class RegisteredUser {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public fullName: string;

    @Column()
    public phoneNumber: string;

    @Column({
        type: "bigint",
    })
    public mid: number;

    @ManyToOne((_type) => Payment, (payment) => payment.registers)
    public payment: Payment;

    @ManyToOne((_type) => Trip, (trip) => trip.registers)
    public trip: Trip;
}

// tslint:disable-next-line: max-classes-per-file
@Entity()
export class Contact {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public fullName: string;

    @Column()
    public contactInfo: string;

    @Column()
    public subject: string;

    @Column()
    public text: string;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;
}
