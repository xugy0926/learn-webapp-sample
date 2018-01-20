import express from 'express';
import * as auth from './middlewares/auth';
import * as post from './controllers/post';
import * as user from './controllers/user';

const router = express.Router();

/* GET users lists. */
router.get('/users', user.more);

/* GET posts lists */
router.get('/posts', post.more);

/* GET one post */
router.get('/posts/:id', post.one);

/* POST create post */
router.post('/posts', auth.adminRequired, post.create);

/* PATCH edit post */
router.patch('/posts/:id', auth.adminRequired, post.update);

/* POST signup user */
router.post('/signup', user.signup);

/* POST signin user */
router.post('/signin', user.signin);

/* GET active account */
router.get('/activeAccount', user.activeAccount);

export default router;
