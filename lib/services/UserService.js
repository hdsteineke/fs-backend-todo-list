const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = class UserService {
  //creating a user with an email and hashed password
  static async create({ email, password }) {
    //invalid email length bc a valid email is 7 characters minimum (ex: a@b.com)
    if (email.length <= 6) {
      throw new Error('Invalid email');
    }
    if (password.length < 10) {
      throw new Error('Password must be at least 10 characters long');
    }
    //takes user password and hashes it 
    const passwordHash = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );
    //sends user email and hashed password along to be stored in user table
    const user = await User.insert({
      email,
      passwordHash,
    });
  
    return user;
  }

  static async signIn({ email, password = '' }) {
    try {
      const user = await User.getByEmail(email);

      if (!user) throw new Error('Invalid email');
      if (!bcrypt.compareSync(password, user.passwordHash))
        throw new Error('Invalid password');

      const token = jwt.sign({ ...user }, process.env.JWT_SECRET, {
        expiresIn: '1 day',
      });

      return token;
    } catch (error) {
      error.status = 401;
      throw error;
    }
  }
};
