import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../../.env") });

[
    "JWT_EXP",
    "JWT_SECRET",
    "SENDURL",
    "VERIFYURL",
    "PG_ADDRESS",
    "DB_NAME",
    "PG_PASSWORD",
    "PG_PORT",
    "PG_USERNAME",
    "PORT",
  ].forEach((name) => {
    if (!process.env[name]) {
      throw new Error(`Environment variable ${name} is missing`);
    }
});

export default {
    JWT: {
        exp: process.env.JWT_EXP,
        secret: process.env.JWT_SECRET || "secret",
    },
    kave: {
        sendURL: process.env.SENDURL ? process.env.SENDURL : "",
        verify: process.env.VERIFYURL ? process.env.VERIFYURL : "",
    },
    pay: {
        callback: process.env.PAYCALLBACK || "http://rest.3tour.ir/payment/check",
        desc: process.env.PAYDESC || "رزرو تور گردشگری",
        email: process.env.PAYEMAIL || "hordimad21@gmail.com",
        phone: process.env.PAYPHONE || "09166599516",
    },
    pg: {
        address: process.env.PG_ADDRESS,
        dbname: process.env.DB_NAME,
        password: process.env.PG_PASSWORD,
        port: process.env.PG_PORT,
        type: process.env.PG_TYPE,
        username: process.env.PG_USERNAME,
    },
    port: process.env.PORT,
    resp: {
        data: {},
        errorCode: 0,
        message: "",
        result: true,
    },
};
