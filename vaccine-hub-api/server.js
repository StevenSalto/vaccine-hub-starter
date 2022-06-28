const express = require("express");
const cors = require("cors");
const {BadRequestError, NotFoundError} = require("./utils/errors");
const { reset } = require("nodemon");
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.use((req, res, next) => {
    return next(new NotFoundError())
})
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
        error: {message, status},
    })
})
app.listen(PORT, () => {
    console.log(`Server running http://localhost:${PORT}`);
})