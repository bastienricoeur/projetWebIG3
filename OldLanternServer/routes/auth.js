var jwt = require('jwt-simple');
var pg = require("pg");
var conString = require('../config/database').url;
var seed = require('../config/sha').seed;
var crypto = require('crypto');

var auth = {
  login: function(req, res) {
    var username = req.body.username || '';
    var password = req.body.password || '';

    if (username == '' || password == '') {
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }
    password = crypto.createHmac('sha256', seed).update(password).digest('hex');
    auth.validate(username,password,function(result){

      if (!result) { // If authentication fails, we send a 401 back
        res.status(401);
        res.json({
          "status": 401,
          "message": "Invalid credentials"
        });
        return;
      }
      else {
        if(result=="errorDB"){
          res.status(501);
          res.json({
            "status": 501,
            "message": "Error on database"
          });
          return;
        }
        else {
          if (result) {
            var role;
            if(result.isadmin){role="admin";}
            else {role="user";}

            res.status(200);
            res.json(genToken(result.mail,result.prenom,result.nom,result.adresse,result.telephone,role));
          }
        }
      }

    });


  },

  validate: function(username, password, callback) {
    pg.connect(conString, function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);

      }
      client.query('SELECT * FROM utilisateur WHERE mail=($1) AND mdp=($2)',[username,password], function(err, result) {
        //call `done()` to release the client back to the pool
        done();

        if(err) {
          callback("errorDB");
          return;
        }
        callback(result.rows[0]);
        return;
      });

    });

  }
}
// private method
function genToken(username,prenom,nom,adresse,tel,role) {
  var expires = expiresIn(1); // 7 days
  var token = jwt.encode({
    exp: expires,
    id: username,
    role: role,
  }, require('../config/secret')());
  return {
    token: token,
    expires: expires,
    link: {
      self:"/login"
    },
    data: {
      type: "user",
      id: username,
      attribute:{
        prenom: prenom,
        role: role,
        nom: nom,
        adresse: adresse,
        telephone: tel
      }
    }

  };
}
function expiresIn(numDays) {
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}
module.exports = auth;
