const passport = require('passport');
const router = require('express').Router();

let id;

router.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    console.log(req.session.userId);
    res.redirect('/admin');
  });

router.get('/invite/:id', (req, res) => {
  id = req.params.id;
  res.render('auth/guestLogin.handlebars');
});

module.exports = router;
