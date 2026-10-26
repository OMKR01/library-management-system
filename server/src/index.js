import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRouter from './routes/auth.routes.js';
import copiesRouter from './routes/copies.routes.js';
import membersRouter from './routes/members.routes.js';
import borrowsRouter from './routes/borrows.routes.js';
import circulationRouter from './routes/circulation.routes.js';
import booksRouter from './routes/books.routes.js';
import authorsRouter from './routes/authors.routes.js';
import categoriesRouter from './routes/categories.routes.js';
import adminMembersRouter from './routes/admin.members.routes.js';
import adminCopiesRouter from './routes/admin.copies.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ---------- Auth Routes ----------
app.use('/api/auth', authRouter);

// ---------- Public / Lookup Routes ----------
app.use('/api/copies', copiesRouter);
app.use('/api/members', membersRouter);
app.use('/api/borrows', borrowsRouter);

// ---------- Circulation Routes ----------
app.use('/api/circulation', circulationRouter);

// ---------- Admin / CRUD Routes ----------
app.use('/api/books', booksRouter);
app.use('/api/authors', authorsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/admin/members', adminMembersRouter);
app.use('/api/admin/copies', adminCopiesRouter);

// ---------- Error Handler ----------
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));