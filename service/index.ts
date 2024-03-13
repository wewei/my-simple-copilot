import * as path from "node:path";
import * as express from "express";
import * as bodyParser from "body-parser";

const app = express();

const port = 3000;

app.get("/", (_, res) => {
    res.redirect("/static/index.html");
});

app.use("/static", express.static(path.resolve(__dirname, '../dist')));

const apiRoute = express.Router();

apiRoute.use(bodyParser.json());

apiRoute.post("/chat", (req, res) => {
    res.json(req.body);
    res.status(200);
});

app.use("/api", apiRoute);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
