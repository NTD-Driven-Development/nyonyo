const express = require("express");
const app = express();

const userRouter = require('./routers/Poker')
app.use('/poker', userRouter)

app.listen(5000, function () {
    console.log("伺服器起上線-> http://localhost:5000");
});