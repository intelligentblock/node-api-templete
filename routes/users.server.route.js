import express from 'express';
import * as userController from '../controllers/user.service.controller';
const router = express.Router();

router.route('/userRegistration').post(userController.addUser);

router.route('/userAuthenticate').post(userController.loginUser);

router.route('/userLogout').get(userController.logoutUser);

export default router;