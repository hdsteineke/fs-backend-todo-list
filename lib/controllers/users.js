const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const UserService = require('../services/UserService');


const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
const IS_DEPLOYED = process.env.NODE_ENV === 'production';

module.exports = Router()
  //post request to users table
  .post('/', async (req, res, next) => {
    try {
      //sends user data through user service for password to be hashed before storing it in the user table
      const user = await UserService.create(req.body);
      res.json(user);
    } catch (error) {
      next (error);
    }
  })
  
  .post('/sessions', async (req, res, next) => {
    try {
      //setting the provided email and password to the request body
      const { email, password } = req.body;
      //stores current session token data in a variable to later be included with cookie
      const sessionToken = await UserService.signIn({
        email,
        password
      });

      res
      //cookie is set to current user 
        .cookie(process.env.COOKIE_NAME, sessionToken, {
          httpOnly: true,
          secure: IS_DEPLOYED,
          sameSite: IS_DEPLOYED ? 'none' : 'strict',
          maxAge: ONE_DAY_IN_MS,
        })
        .json({ message: 'Signed in successfully!' });
    } catch (error) {
      next (error);
    }
  })
  
  .get('/me', authenticate, (req, res) => {
    res.json(req.user);

  });
