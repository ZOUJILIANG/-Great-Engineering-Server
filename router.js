const express = require('express');
// 引入jwt token工具
const JwtUtil = require('./tool/jwt');
const fs = require('fs');
var cheerio = require("cheerio");
var server = require("./tool/curl.js");
const router = express.Router();

router.get('/getHtml', (req, res, next) => {
  let token = req.headers.token;
    let jwt = new JwtUtil(token);
    let result = jwt.verifyToken();
  if (result == 'err') {
    var err = new Error('登陆过期');
    next(err);
  } else {
    const url = "https://www.baidu.com/"

    server.download(url, function(data) {
      if (data) {
        var $ = cheerio.load(data);
      console.log($("app-root"));
        $("app-root").each(function(i, e) {
          
          res.send(e.toString());
        });

        console.log("done");
      } else {
          console.log("error");
      } 
    });
  }
});

router.get('/getHomeContent', (req, res, next) => {
  let token = req.headers.token;
    let jwt = new JwtUtil(token);
    let result = jwt.verifyToken();
  if (result == 'err') {
    var err = new Error('登陆过期');
    next(err);
  } else {
    res.send({message: 'sucess'});
  }
});

router.post('/login', (req, res) => {
    fs.readFile('./../data.json',function(err,data){
      if(err){
        return console.error(err);
    }
    var person = data.toString();//将二进制的数据转换为字符串
    person = JSON.parse(person);//将字符串转换为json对象
    const login_Pass = person['data'].filter((element1) => {
        return req.body.username === element1.name && req.body.password === element1.password;
      });
      if(login_Pass.length){
        // 登陆成功，添加token验证
        let password = req.password;
        // 将用户id传入并生成token
        let jwt = new JwtUtil(password);
        let token = jwt.generateToken();
        res.send({code:200,message:'登陆成功',person: person,token:token});
      }else {
        res.send({code: 'INVALID',message:'用户名密码不正确'})
      }
    
  });
});

router.post('/registered', (req, res, next) => {
  if (req.body.name == '') {
    return res.status(404).send('Name is empty')
  }
    fs.readFile('./../data.json',function(err,data){
      if(err){
          return console.error(err);
      }
      var person = data.toString();//将二进制的数据转换为字符串
      person = JSON.parse(person);//将字符串转换为json对象
      person.data.push(req.body);//将传来的对象push进数组对象中
      person.total = person.data.length;//定义一下总条数，为以后的分页打基础
      var str = JSON.stringify(person);//因为nodejs的写入文件只认识字符串或者二进制数，所以把json对象转换成字符串重新写入json文件中
      fs.writeFile('./../data.json',str,function(err){
          if(err){
            return res.status(500).send(err)
          }
          // 登陆成功，添加token验证
        let password = req.password;
        // 将用户id传入并生成token
        let jwt = new JwtUtil(password);
        let token = jwt.generateToken();
        // 将 token 返回给客户端
        return res.send({code:200,message:'注册成功',token:token});
      })
  })
});

router.post('/setToken', (req, res, next) => {
    // 登陆成功，添加token验证
    let password = req.password;
    // 将用户id传入并生成token
    let jwt = new JwtUtil(password);
    let token = jwt.generateToken();
    // 将 token 返回给客户端
    return res.send({code:200,message:'获取成功',token:token});
  });

module.exports = router;