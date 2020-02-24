const router = require('express').Router();

router.get('/invite', (req, res) => {
  res.render('auth/guestLogin.handlebars');
});

module.exports = router;
