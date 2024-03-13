import * as path from "node:path";
import * as express from "express";

const app = express();

const port = 3000;

app.use("/", express.static(path.resolve(__dirname, '../dist')));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
