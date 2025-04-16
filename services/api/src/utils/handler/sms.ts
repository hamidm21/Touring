import * as req from "request-promise";
import conf from "../config";

export async function send(number: string,
                           template: "validated" | "purchased" | "notify", ...args: string[]): Promise<any> {
    switch (template) {
        case "validated": {
            return await req({
                uri: conf.kave.verify,
                // tslint:disable-next-line: object-literal-sort-keys
                method: "POST",
                form: {
                    receptor: number,
                    template,
                    token: args[0].split(" ").join("."),
                },
            });
        }
        case "purchased": {
            return await req({
                uri: conf.kave.verify,
                // tslint:disable-next-line: object-literal-sort-keys
                method: "POST",
                form: {
                    receptor: number,
                    template,
                    token: args[0].split(" ").join("."),
                    token2: args[1].split(" ").join("."),
                    token3: args[2].split(" ").join("."),
                },
            });
        }
        case "notify": {
            return await req({
                uri: conf.kave.verify,
                // tslint:disable-next-line: object-literal-sort-keys
                method: "POST",
                form: {
                    receptor: number,
                    template,
                    token: args[0].split(" ").join("."),
                    token2: args[1].split(" ").join("."),
                },
            });
        }
    }
}

export async function verification(number: string, template: "verify", ...args: string[] | number[]): Promise<any> {
    return await req({
        uri: conf.kave.verify,
        // tslint:disable-next-line: object-literal-sort-keys
        method: "POST",
        form: {
            receptor: number,
            template,
            token: args[0],
        },
    });
}
