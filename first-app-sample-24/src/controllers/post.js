import PostModel from '../models/post';
import UserModel from '../models/user';
import config from '../config';

export const more = function(req, res, next) {
  PostModel.find({}, {}, function(err, posts) {
    if (err) {
      next(err);
    } else {
      res.json({ postsList: posts });
    }
  });
};

export const one = function(req, res, next) {
  const id = req.params.id;

  PostModel.findOne({ _id: id }, function(err, post) {
    if (err) {
      next(err);
    } else {
      res.json({ post });
    }
  });
};

export const create = function(req, res, next) {
  const { title, content } = req.body;

  const post = new PostModel();
  post.title = title;
  post.content = content;
  post.authorId = res.locals.currentUser._id;
  post.save(function(err, doc) {
    if (err) {
      next(err);
    } else {
      res.json({ post: doc });
    }
  });
};

export const update = function(req, res, next) {
  const { id, title, content } = req.params;

  PostModel.findOneAndUpdate({ _id: id }, { title, content }, function(err) {
    if (err) {
      next(err);
    } else {
      res.end();
    }
  });
};
