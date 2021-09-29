import { Router } from 'express';
import log from "../logger/logger";
import pingRoutes from "./ping/ping.routes";
import userRoutes from "./user/user.routes";


const router: Router = Router();

router.use('/ping', pingRoutes);
router.use('/user', userRoutes);

export default router;