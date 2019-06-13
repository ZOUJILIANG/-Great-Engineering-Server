const express = require('express');
const app = express();
const wiki = require('./router.js');
const bodyParser = require('body-parser');
const JwtUtil = require('./tool/jwt');
// parse application/x-www-form-urlencoded

// parse application/json
app.use(bodyParser.json())

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Headers", "Content-Type, Accept, token, Authorization, X-Auth-Token, X-XSRF-TOKEN, X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,Access-Control-Allow-Headers");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Credentials", "true"); //是否允许浏览器携带用户身份信息（cookie）
  next();
});
app.use(function (req, res, next) {
  // 我这里知识把登陆和注册请求去掉了，其他的多有请求都需要进行token校验 
  if (req.url != '/wiki/login' && req.url != '/wiki/registered' && req.url != '/wiki/setToken') {
      let token = req.headers.token;
      let jwt = new JwtUtil(token);
      let result = jwt.verifyToken();
      // 如果考验通过就next，否则就返回登陆信息不正确
      if (result == 'err') {
          res.send({status: 403, msg: '登录已过期,请重新登录'});
          // res.render('login.html');
      } else {
        console.log('验证通过')
          next();
      }
  } else {
      next();
  }
});
app.use('/wiki', wiki);
app.listen(8080);
console.log('Listening on port 8080...');
