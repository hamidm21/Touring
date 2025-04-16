import { dashRoute } from "../../dashboard";
import { userRoute } from "../../user";
import { tripRoute } from "../../trip";
import { financeRoute } from "../../finance";
import { authRoute } from "../../auth";
import { isAuthenticated } from "../middleware/auth";

export default function(app: any) {
    app.use("/auth", authRoute);
    app.use("/login", authRoute);
    app.use("/trips", isAuthenticated, tripRoute);
    app.use("/users", isAuthenticated, userRoute);
    app.use("/finances", isAuthenticated, financeRoute);
    app.use("/dashboard", isAuthenticated, dashRoute);
}
