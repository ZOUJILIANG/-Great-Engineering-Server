const express = require('express');
var fs = require('fs');
const router = express.Router();

router.get('/login', (req, res) => {
    fs.readFile('./../data.json',function(err,data){
      if(err){
        return console.error(err);
    }
    var person = data.toString();//将二进制的数据转换为字符串
    person = JSON.parse(person);//将字符串转换为json对象
    res.send(person)
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
          return res.send(person)
      })
  })
});

module.exports = router;