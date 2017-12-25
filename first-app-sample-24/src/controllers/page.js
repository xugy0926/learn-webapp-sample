import marked from 'marked';
import bcrypt from 'bcrypt';
import PostModel from '../models/post';
import config from '../config';

/* GET home page. */
export const homePage = function(req, res, next) {
  res.render('index');
};

/* GET posts page. */
export const postsPage = function(req, res, next) {
  res.render('posts', { title: '我的文章' });
};

/* GET posts create page. */
export const createPage = function(req, res, next) {
  res.render('create');
};

/* GET posts edit page. */
export const editPage = function(req, res, next) {
  const { id } = req.query;

  res.render('edit', { id });
};

/* GET posts show page. */
export const showPage = function(req, res, next) {
  const { id } = req.query;

  PostModel.findOne({ _id: id }, function(err, post) {
    post.mkContent = marked(post.content);
    res.render('show', { post });
  });
};

/* GET signup page. */
export const signupPage = function(req, res, next) {
  res.render('signup');
};

/* GET signin page. */
export const signinPage = function(req, res, next) {
  res.render('signin');
};

/* GET signout */
export const signout = function(req, res, next) {
  res.clearCookie(config.cookieName, { path: '/' });
  res.redirect('/');
};
