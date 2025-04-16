import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class FreeTrip1580541580228 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const trip = await queryRunner.getTable("trip");
        // const desc = receipt!.findColumnByName("description")!;
        const column = new TableColumn({
            default: false,
            name: "free",
            type: "boolean",
        });
        if (trip) {
            // await queryRunner.dropColumn(receipt, desc);
            await queryRunner.addColumn(trip, column);
        }
    }

    public async down(_queryRunner: QueryRunner): Promise<any> {
        //
    }

}
