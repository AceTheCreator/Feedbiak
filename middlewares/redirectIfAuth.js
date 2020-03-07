module.exports = (req, res, next) => {
  if (req.session.userId || req.session.guestId) {
    return res.redirect(`/admin`);
  }
  next();
};
