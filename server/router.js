import express from 'express';
import keywordController from './search/keywordController.js';

const router = express.Router();

router.get('/today', keywordController.today);
router.post('/sub', keywordController.sub);
router.post('/article', keywordController.article);

export default router;
