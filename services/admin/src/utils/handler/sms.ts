import req from "request-promise";
import conf from "../config";

export async function send(number: string, ...args: string[]): Promise<any> {
    return await req({
        uri: conf.kave.verify,
        // tslint:disable-next-line: object-literal-sort-keys
        method: "POST",
        form: {
            receptor: number,
            template: "bill",
            token: args[0].split(" ").join("."),
        },
    });
}
