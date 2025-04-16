import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddFreeTrip1579350778371 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const payment = await queryRunner.getTable("payment");
        // const desc = receipt!.findColumnByName("description")!;
        const column = new TableColumn({
            default: false,
            name: "free",
            type: "boolean",
        });
        if (payment) {
            // await queryRunner.dropColumn(receipt, desc);
            await queryRunner.addColumn(payment, column);
        }
    }

    public async down(_queryRunner: QueryRunner): Promise<any> {
        //
    }

}
