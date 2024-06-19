const { Router } = require("express");
const giftController = require("../controllers/giftController");
// const requireAuth = require("../middleware/requireAuth");
const router = Router();

// // router.use(requireAuth);

// routers children
router.post("/", giftController.gifts_post);
// Get All gift
router.get("/", giftController.gifts_report_get_all);
router.get("/:id", giftController.single_get_gift);
router.patch("/:id", giftController.gift_update);

// delete
router.delete("/:id", giftController.gift_delete);
module.exports = router;
