var passport = require('passport');
var User = require("../models/user");
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
/**
 * passport 使用策略（这里用的是 LocalStrategy）来进行验证，验证策略可以是
 * 通过用户名和密码来验证，也可以是 OAuth 这样代理进行验证
 * 会返回一个 done（err，对象，信息） 回调函数
 */
passport.use('local.signup',new LocalStrategy(
    {
        usernameField:'email',
        passwordField:'password',
        passReqToCallback:true
    },
  function(req,email, password, done) {
      req.checkBody('email','邮件地址无效')
        .notEmpty()
        .isEmail();
      req.checkBody('password','密码无效')
        .notEmpty()
        .isLength({min:4});
    var errors = req.validationErrors();

    if(errors){
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });

        return done(null,false,req.flash('error',messages))
    }
    //查找用户
    /**
     * 此部分逻辑可以移到 user 模型中
     */
    User.findOne({ 'email': email }, function(err, user) {
      if (err) { return done(err); }
      if (user) {
        return done(null, false, { message: "此邮件已经被注册" });
      }
      var newUser = new User();
      newUser.email = email;
      newUser.password = newUser.encryptPassword(password);
      newUser.save(function(err,result){
          if(err){
              return done(err);
          }
          return done(null,newUser);
      });
      
    });
  }));

  passport.use('local.signin',new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
  },function(req,email,password,done){
      req.checkBody('email','邮件地址无效')
        .notEmpty()
        .isEmail();
      req.checkBody('password','密码无效')
        .notEmpty();
    var errors = req.validationErrors();

    if(errors){
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });

        return done(null,false,req.flash('error',messages))
    }
    
    User.findOne({ 'email': email }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
            return done(null, false, { message: "没有找到该用户" });
        }
        if(!user.validPassword(password)){
            return done(null, false, { message: "密码不正确" });
        }
        return done(null,user);
    });
  }))


