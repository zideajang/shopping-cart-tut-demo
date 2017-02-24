var express = require('express');
var router = express.Router();
//引入 csurf 模块
var csrf = require('csurf');
var passport = require('passport');

/**
 * 设置路由中间件
 * 创建时可以接受一个参数
 */
var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile',isLoggedIn,function(req,res,next){
  res.render('user/profile');
});

router.get('/logout',isLoggedIn,function(req,res,next){
    req.logout();
    res.redirect('/');
});

router.use('/',notLoggedIn,function (req,res,next) {
    next();
})

router.get('/signup',function(req,res,next){
  var messages = req.flash('error');
  res.render('user/signup',{
    csrfToken: req.csrfToken(),//
    messages:messages,
    hasErrors:messages.length > 0
  })
});
/**
 * 
 */
router.post('/signup',passport.authenticate('local.signup',{
    successRedirect: '/user/profile',//验证成功跳转到 profile 页面
    failureRedirect: '/user/signup',//验证失败跳转回注册页面
    failureFlash: true
}));


router.get('/signin',function(req,res,next){
  var messages = req.flash('error');
  res.render('user/signin',{
    csrfToken: req.csrfToken(),
    messages:messages,
    hasErrors:messages.length > 0
  });
});

router.post('/signin',passport.authenticate('local.signin',{
    successRedirect: '/user/profile',
    failureRedirect: '/user/signin',
    failureFlash: true
}));

module.exports = router;
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req,res,next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}
