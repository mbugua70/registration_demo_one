const { Router } = require("express");
const dealersControllers = require("../controllers/dealersController");
const requireAuth = require("../middleware/requireAuth");
const router = Router();

// router.use(requireAuth);

// routers children

// Get All Workouts
router.get("/search", dealersControllers.dealers_search_all);

module.exports = router;
