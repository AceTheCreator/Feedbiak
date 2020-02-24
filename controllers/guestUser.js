const passport = require('passport');
const router = require('express').Router();


router.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/invite' }),
  (req, res) => {
    console.log(req.session.userId);
    res.redirect('/admin');
  });

router.get('/invite', (req, res) => {
  res.render('auth/guestLogin.handlebars');
});

module.exports = router;
