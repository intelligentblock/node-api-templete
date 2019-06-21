import express from 'express';
import * as instractionController from '../controllers/instraction.service.controller';
import * as userController from '../controllers/user.service.controller';
const router = express.Router();
router.route('/instraction').get(userController.loginRequiredUser,instractionController.readAllInstraction);
router.route('/instraction').post(userController.loginRequiredUser,instractionController.addInstraction);
router.route('/instraction/:id').put(userController.loginRequiredUser,instractionController.updateInstractionById);
router.route('/instraction/:id').get(userController.loginRequiredUser,instractionController.getInstractionById);
router.route('/instraction/:id').delete(userController.loginRequiredUser,instractionController.deleteInstracvtionById);

export default router;