const router = require("express").Router();
const mw = require("./auth-middleware");
const userModel = require("../models/users-model");
const utils = require("../../helpers/utils");

router.post(
  "/register",
  mw.payLoadCheck,
  mw.userNameCheck,
  async (req, res, next) => {
    /*
    EKLEYİN
    Uçnoktanın işlevselliğine yardımcı olmak için middlewarelar yazabilirsiniz.
    2^8 HASH TURUNU AŞMAYIN!
    1- Yeni bir hesap kaydetmek için istemci "kullanıcı adı" ve "şifre" sağlamalıdır:
      {
        "username": "Captain Marvel", // `users` tablosunda var olmalıdır
        "password": "foobar"          // kaydedilmeden hashlenmelidir
      }
    2- BAŞARILI kayıtta,
      response body `id`, `username` ve `password` içermelidir:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }
    3- Request bodyde `username` ya da `password` yoksa BAŞARISIZ kayıtta,
      response body şunu içermelidir: "username ve şifre gereklidir".
    4- Kullanıcı adı alınmışsa BAŞARISIZ kayıtta,
      şu mesajı içermelidir: "username alınmış".
  */
    try {
      const newUserObj = {
        username: req.body.username,
        password: req.encPassword,
      };
      let insertedUser = await userModel.insertUser(newUserObj);
      res.status(201).json(insertedUser);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/login",
  mw.payLoadCheck,
  mw.passwordCheck,
  async (req, res, next) => {
    /*
    EKLEYİN
    Uçnoktanın işlevselliğine yardımcı olmak için middlewarelar yazabilirsiniz.
    1- Var olan bir kullanıcı giriş yapabilmek için bir `username` ve `password` sağlamalıdır:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }
    2- BAŞARILI girişte,
      response body `message` ve `token` içermelidir:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }
    3- req body de `username` ya da `password` yoksa BAŞARISIZ giriş,
      şu mesajı içermelidir: "username ve password gereklidir".
    4- "username" db de yoksa ya da "password" yanlışsa BAŞARISIZ giriş,
      şu mesajı içermelidir: "geçersiz kriterler".
  */
    try {
      const payload = {
        username: req.user.username,
      };
      let token = utils.generateToken(payload, "1d");
      res.status(200).json({
        message: `welcome, ${req.user.username}`,
        token: token,
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
