import { CorsOptions } from "cors";
import { allowedOrigins } from "./allowedOrigins";

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("not allowed by CORS"))
    }
  }
}

export default corsOptions