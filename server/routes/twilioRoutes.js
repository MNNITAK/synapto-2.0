import express from 'express';
import {sendWhatsAppAlerts} from  "../controllers/Whatsappalert.js"


const router = express.Router();



router.post('/admin', sendWhatsAppAlerts);


export default router;