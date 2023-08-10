import express from "express";
const router = express.Router();
import userController from "../controllers/usercontroller.js";
import authcheck from "../middleware/authcheck.js"


router.use("/changepass", authcheck);
router.use("/userinfo", authcheck);


//public routes
router.post("/register", userController.userRegistration);
router.post("/login", userController.userLogin);
router.put("/resetpass", userController.resetPassEmail);
router.put("/pass-reset-using-link/:id/:token", userController.passResetUsingLink);


//private routes
router.put("/changepass",  userController.changePassword);
router.get("/userinfo",  userController.loggedUserInfo);

export default router