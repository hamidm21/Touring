import {Entity, PrimaryGeneratedColumn, Column,
    CreateDateColumn, UpdateDateColumn,
    OneToOne, JoinColumn, OneToMany} from "typeorm";
import { User, Trip, Payment, Receipt} from ".";

@Entity()
export class Tour {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @Column()
    public commission: number;

    @OneToOne((_type) => User, (user) => user.tour)
    @JoinColumn()
    public leader: User;

    @OneToMany((_type) => User, (user) => user.agency)
    public leaders: User[];

    @OneToMany((_type) => Trip, (trip) => trip.tour)
    public trips: Trip[];

    @OneToMany((_type) => Payment, (payment) => payment.tour)
    public payments: Payment[];

    @OneToMany((_type) => Receipt, (receipt) => receipt.tour)
    public receipts: Receipt[];

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;
}
