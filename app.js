import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import userrouter from "./routes/userrouter.js"
import "./config/connectdb.js"


dotenv.config(); 
const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/routes/",userrouter )

app.get("/", (req, res) => {
    res.send("i'm workingz");
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost/${port}`);
})
