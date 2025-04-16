import {Entity, PrimaryGeneratedColumn, Column,
    CreateDateColumn, UpdateDateColumn, OneToMany,
    ManyToOne, ManyToMany} from "typeorm";
import { Payment, Tour, User, RegisteredUser, Receipt } from ".";

@Entity()
export class Trip {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public title: string;

    @Column()
    public bannerURL: string;

    @Column()
    public imgURL: string;

    @Column()
    public description: string;

    @Column()
    public text: string;

    @Column()
    public origin: string;

    @Column()
    public destination: string;

    @Column()
    public price: number;

    @Column()
    public capacity: number;

    @Column({
        unique: true,
    })
    public webAddr: string;

    @Column({
        unique: true,
    })
    public slug: string;

    @Column((_type) => ContactInfo)
    public contactInfo: ContactInfo;

    @Column((_type) => DataTable)
    public dataTable: DataTable;

    @Column({
        default: 0,
    })
    public registered: number;

    @Column()
    public tourName: string;

    @Column({
        default: false,
    })
    public archived: boolean;

    @Column({
        default: false,
    })
    public free: boolean;

    // Deadline for registering in trip
    @Column({
        nullable: true,
    })
    public deadLine: Date;

    @OneToMany((_type) => RegisteredUser, (registers) => registers.trip)
    public registers: RegisteredUser[];

    // Opening date of the trip
    @Column({
        nullable: true,
    })
    public openingDate: Date;

    @Column({
        nullable: true,
    })
    public closingDate: Date;

    @Column({
        nullable: true,
    })
    public prOpeningDate: string;

    @Column({
        nullable: true,
    })
    public prClosingDate: string;

    @Column({
        array: true,
    })
    public images: string;

    @ManyToOne((_type) => User, (user) => user.leadTrips)
    public leader: User;

    @Column()
    public leaderName: string;

    @OneToMany((_type) => Payment, (payment) => payment.trip)
    public payments: Payment[];

    @OneToMany((_type) => Receipt, (receipt) => receipt.trip)
    public receipts: Receipt[];

    @ManyToOne((_type) => Tour, (tour) => tour.trips)
    public tour: Tour;

    @ManyToMany((_type) => User, (user) => user.trips)
    public users: User[];

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;
}

// tslint:disable-next-line: max-classes-per-file
class ContactInfo {
    @Column()
    public email: string;

    @Column()
    public phoneNumber: string;
}

// tslint:disable-next-line: max-classes-per-file
class DataTable {
    @Column()
    public openingDate: string;

    @Column()
    public duration: string;

    @Column()
    public closingDate: string;

    @Column()
    public leader: string;

    @Column()
    public vehicle: string;

    @Column()
    public distance: string;

    @Column()
    public required: string;

    @Column()
    public services: string;

    @Column()
    public extra: string;

    @Column()
    public origin: string;

    @Column()
    public destination: string;

}
