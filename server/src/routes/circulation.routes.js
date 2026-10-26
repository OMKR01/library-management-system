import { Router } from 'express';
import { issueBook, returnBook } from '../controllers/borrow.controller.js';

const router = Router();

// POST issue a book to a member
router.post('/issue', issueBook);

// POST return a book
router.post('/return', returnBook);

export default router;
