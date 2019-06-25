const JwtUtil = require('../tool/jwt');
class TokenService {
  async getTokenValid(req) {
    let token = req.headers.token;
    let jwt = new JwtUtil(token);
    let result = jwt.verifyToken();
    // 如果考验通过就next，否则就返回登陆信息不正确
    if (result == 'err') {
        return 0
        // res.render('login.html');
    } else {
      return 1
    }
  }
}
module.exports = TokenService;