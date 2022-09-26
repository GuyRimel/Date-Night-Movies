const
  jwtSecret = 'your_jwt_secret', // must match the key from JWTStrategy found in 'passport.js'
  jwt = require('jsonwebtoken'),
  passport = require('passport');

require('./passport.js');

let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, // Username is being encoded in the JWT
    expiresIn: '7d', // set token expiration
    algorithm: 'HS256' // algorithm used to 'sign' the JWT
  });
}


// POST login //////////
module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if(err || !user) {
        return res.status(400).json({
          message: 'Something\'s off here...',
          user: user
        });
      }
      req.login(user, { session: false }, (err) => {
        if(err) {
          res.send(err);
          console.log(err);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
}
