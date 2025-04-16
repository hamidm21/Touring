import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

// tslint:disable-next-line: class-name
export class addDescToRecp1578386317432 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const receipt = await queryRunner.getTable("receipt");
        // const desc = receipt!.findColumnByName("description")!;
        const column = new TableColumn({
            isNullable: true,
            name: "description",
            type: "character varying",
        });
        if (receipt) {
            // await queryRunner.dropColumn(receipt, desc);
            await queryRunner.addColumn(receipt, column);
        }
    }

    public async down(_queryRunner: QueryRunner): Promise<any> {
        //
    }

}
