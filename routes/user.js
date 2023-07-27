import express from "express";
import { signUp, signIn, confirm, sendConfirm, getUser, forgotPassword, resetPassword  } from "../controllers/user.js";
import user from "../middleware/user.js";
const router = express.Router();


router.post('/signUp', signUp);
router.post('/signIn', signIn);
router.get('/confirm/:token', confirm);
router.post('/sendConfirm', sendConfirm);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword', resetPassword);
router.get('/getUser',user, getUser);


export default router;