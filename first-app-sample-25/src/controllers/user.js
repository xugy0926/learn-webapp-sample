import bcrypt from 'bcrypt'
import PostModel from '../models/post'
import UserModel from '../models/user'
import config from '../config'
import jwt from 'jwt-simple'
import moment from 'moment'

export const signup = function (req, res, next) {
  const { name, pass, rePass } = req.body

  if (pass !== rePass) {
    return next(new Error('两次密码不对'))
  }

  const user = new UserModel()
  user.name = name
  user.pass = bcrypt.hashSync(pass, 10)
  user.save()
    .then(() => {
      res.end()
    })
    .catch(next)
}

export const signin = function (req, res, next) {
  const { name, pass } = req.body

  UserModel.findOne({ name}).exec()
    .then(user => {
      if (!user) {
        throw new Error('找不到用户')
      } else {
        const isOk = bcrypt.compareSync(pass, user.pass)
        if (!isOk) {
          return next(new Error('密码不对'))
        }

        const token = jwt.encode(
          {
            _id: user._id,
            name: user.name,
            isAdmin: user.loginname === config.admin,
            exp: moment()
              .add('days', 30)
              .valueOf()
          },
          config.jwtSecret
        )

        const opts = {
          path: '/',
          maxAge: moment()
            .add('days', 30)
            .valueOf(),
          signed: true,
          httpOnly: true
        }

        res.cookie(config.cookieName, token, opts)
        res.json({ token})
      }
    })
    .catch(next)
}

export const more = function (req, res, next) {
  res.send('respond with a resource')
}
