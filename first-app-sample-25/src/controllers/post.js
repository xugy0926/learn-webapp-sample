import PostModel from '../models/post'
import UserModel from '../models/user'
import config from '../config'

export const more = function (req, res, next) {
  PostModel.find({}, {}).exec()
    .then(posts => {
      res.json({ postsList: posts })
    })
    .catch(next)
}

export const one = function (req, res, next) {
  const id = req.params.id

  PostModel.findOne({ _id: id }).exec()
    .then(post => {
      res.json({ post})
    })
    .catch(next)
}

export const create = function (req, res, next) {
  const { title, content } = req.body

  const post = new PostModel()
  post.title = title
  post.content = content
  post.authorId = res.locals.currentUser._id
  post.save()
    .then(doc => {
      res.json({ post: doc })
    })
    .catch(next)
}

export const update = function (req, res, next) {
  const { id, title, content } = req.params

  PostModel.findOneAndUpdate({ _id: id }, { title, content}).exec()
    .then(() => {
      res.end()
    })
    .catch(next)
}
