import express from "express";
import Log from "../../models/Log";

const router = express.Router();
// @route GET api/items
// @desc all
router.get("/all", (req: express.Request, res: express.Response) => {
    res.send({
        msg: "Log Items",
        logItems: Log.find()
            .sort({ date: -1 })
            .then(logItems => [...logItems])
    })
});

router.get("/item/:id", (req: express.Request, res: express.Response) => {
    const id = parseInt(req.params.id);
    const logItems = Log.find()
        .sort({ date: -1 })
        .then(logItems => [...logItems].filter(item => item.id === id));
    res.send({
        Id: id,
        logItems: logItems
    })
})

module.exports = router;