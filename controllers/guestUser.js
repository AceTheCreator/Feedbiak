const passport = require('passport');
const router = require('express').Router();

let id;


router.get('/invite/:id', (req, res) => {
  id = req.params.id;
  console.log(id);
  res.render('auth/guestLogin.handlebars');
});

router.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    console.log(id);
    console.log(req.session.userId);
    res.redirect('/admin');
  });

module.exports = router;
