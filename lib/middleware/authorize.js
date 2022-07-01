module.exports = async (req, res, next) => {
  try {
    if (!req.user || req.user.email !== 'Authorized user') {
      throw new Error('You do not have access to this.');
    }
  } catch (error) {
    error.status = 403;
    next (error);
  }
};
