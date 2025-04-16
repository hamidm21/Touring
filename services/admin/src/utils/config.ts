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
        secret: process.env.JWT_SECRET,
    },
    kave: {
        sendURL: process.env.SENDURL ? process.env.SENDURL : "",
        verify: process.env.VERIFYURL ? process.env.VERIFYURL : "",
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
    session: {
        mongo_host: process.env.MONGO_HOST || "mongodb://mongo:27018",
        redis_host: process.env.RED_HOST,
        redis_port: process.env.RED_PORT ? parseInt(process.env.RED_PORT, 0) : 6379,
        secret: process.env.SES_SECRET,
    },
};

export enum EMsgs {
    USR_WRONG = "اطلاعات وارد شده صحیح نیست",
    PHN_WRONG = "شماره وارد شده در سیستم ثبت نشده است",
    PSW_WRONG = "پسورد وارد شده با شماره مطابقت ندارد",
    UNKNOWN = "مشکلی پیش آمد لطفا با پشتیبانی تماس حاصل کنید",
}
