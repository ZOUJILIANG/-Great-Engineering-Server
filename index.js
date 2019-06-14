const express = require('express');
const app = express();
const wiki = require('./router.js');
const bodyParser = require('body-parser');
// parse application/json
app.use(bodyParser.json())

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Headers", "Content-Type, Accept, token, Authorization, X-Auth-Token, X-XSRF-TOKEN, X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,Access-Control-Allow-Headers");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Credentials", "true"); //是否允许浏览器携带用户身份信息（cookie）
  next();
});
app.use('/wiki', wiki);
app.listen(8080);
console.log('Listening on port 8080...');
