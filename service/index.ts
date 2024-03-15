import path from "node:path";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import client from "./openai-client";

const port = process.env.PORT || 8080;
const deploymentId = process.env.OPENAI_DEPLOYMENT_ID || "gpt-4";

const app = express();

app.get("/", (_, res) => {
    res.redirect("/static/index.html");
});

app.use("/static", express.static(path.resolve(__dirname, '../dist')));

const embedRoute = express.Router();

embedRoute.use(cors());

embedRoute.use((req, res, next) => {
    res.header({
      "Content-Security-Policy": "frame-ancestors *;",
    });
    next();
});

embedRoute.use(express.static(path.resolve(__dirname, '../embed')));

app.use("/embed", embedRoute);

const apiRoute = express.Router();

apiRoute.use(bodyParser.json());

apiRoute.post("/chat", async (req, res, next) => {
    const { messages, options } = req.body;

    try {
        const oaiRes = await client.getChatCompletions(deploymentId, messages, options);
        res.status(200).json(oaiRes);
    } catch (e: any) {
        res.status(400).send({ message: e.message, stack: e.stack });
    }
});

app.use("/api", apiRoute);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
