const express = require("express");
const { Router } = require("express");
const userAuthController = require("../controllers/userAuthController");
const router = Router();

// login routes

// get all users
router.get("/getusers", userAuthController.users_get_all);

// get singleUser
router.get("/getusers/:id", userAuthController.single_get_user);

router.post("/login", userAuthController.loginUser);

// signup routes

router.post("/signup", userAuthController.signUpUser);

// update user
router.patch("/update/:id", userAuthController.users_update);

// delete user
router.delete("/deleteuser/:id", userAuthController.users_delete);

module.exports = router;
