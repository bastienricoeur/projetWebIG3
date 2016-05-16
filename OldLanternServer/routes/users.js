var jwt = require('jwt-simple');
var pg = require("pg");
var conString = require('../config/database').url;
var seed = require('../config/sha').seed;
var crypto = require('crypto');

var users = {
  getAll: function(req, res) {
    var dbUserObj={};
    users.selectAll(function(results){
      if (!results) { // If authentication fails, we send a 401 back
        res.status(401);
        res.json({
          "status": 401,
          "message": "Invalid credentials"
        });
        return;
      }
      else{
        if (results=="errorDB") { // If authentication fails, we send a 401 back
          res.status(501);
          res.json({
            "status": 501,
            "message": "Error on database"
          });
          return;
        }
        else {
          if (results) {
            var infos =[];
            results.forEach(function(result){
              var role;
              if(result.isadmin){role="admin";}
              else {role="user";}
              infos.push({
                type: "user",
                id: result.mail,
                attribute:{
                  prenom: result.prenom,
                  role: role,
                  nom: result.nom,
                  adresse: result.adresse,
                  telephone: result.telephone
                }
              });
            });

          dbUserObj = {
            link: {
              self:"/api/v1/user"
            },
            data: infos
          };
          res.status(200);
          res.json(dbUserObj);
        }
      }
    }
  });
},

selectAll: function(callback) {
  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT * FROM utilisateur', function(err, result) {
      //call `done()` to release the client back to the pool
      done();

      if(err) {
        callback("errorDB");
        return;
      }
      else {
        callback(result.rows);
        return;
      }
    });
  });
},


getOne: function(req, res) {
  var id = req.params.id;
  if (id == '') {
    res.status(401);
    res.json({
      "status": 401,
      "message": "Invalid credentials"
    });
    return;
  }
  var dbUserObj={};
  users.getUser(id,function(result){
    if (!result) { // If authentication fails, we send a 401 back
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }
    else{
      if (result=="errorDB") { // If authentication fails, we send a 401 back
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
          dbUserObj = {
            link: {
              self:"/api/v1/user/"+result.mail
            },
            data: {
              type: "user",
              id: result.mail,
              attribute:{
                prenom: result.prenom,
                role: role,
                nom: result.nom,
                adresse: result.adresse,
                telephone: result.telephone
              }
            }
          };
          res.status(200);
          res.json(dbUserObj);
        }
      }
    }
  });

},

getProfil: function(req, res) {
  var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
  var decoded = jwt.decode(token, require('../config/secret.js')());
  var id = decoded.id;
  if (id == '') {
    res.status(401);
    res.json({
      "status": 401,
      "message": "Invalid credentials"
    });
    return;
  }
  var dbUserObj={};
  users.getUser(id,function(result){
    if (!result) { // If authentication fails, we send a 401 back
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }
    else{
      if (result=="errorDB") { // If authentication fails, we send a 401 back
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
          dbUserObj = {
            link: {
              self:"/api/v1/user"
            },
            data: {
              type: "user",
              id: result.mail,
              attribute:{
                prenom: result.prenom,
                role: role,
                nom: result.nom,
                adresse: result.adresse,
                telephone: result.telephone
              }
            }
          };
          res.status(200);
          res.json(dbUserObj);
        }
      }
    }
  });
},

getUser: function(username,callback) {
  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT * FROM utilisateur WHERE mail=($1)',[username], function(err, result) {
      //call `done()` to release the client back to the pool
      done();

      if(err) {
        callback("errorDB");
        return;
      }
      else {
        callback(result.rows[0]);
        return;
      }
    });
  });
},


create: function(req, res) {
  var username = req.body.username || '';
  var password = req.body.password || '';
  var nom = req.body.nom || '';
  var prenom= req.body.prenom || '';
  var adresse = req.body.adresse || '';
  var tel = req.body.telephone || '';

  if (username == '' || password == '' || nom == '' || prenom == '' || adresse == '' || tel == '') {
    res.status(401);
    res.json({
      "status": 401,
      "message": "Invalid credentials"
    });
    return;
  }
  password = crypto.createHmac('sha256', seed).update(password).digest('hex');
  var dbUserObj={};
  users.insert(username,password,nom,prenom,adresse,tel,function(result){
    if (!result) { // If authentication fails, we send a 401 back
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }
    else{
      if (result=="errorDB") { // If authentication fails, we send a 401 back
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
          dbUserObj = {
            link: {
              self:"/subscribe"
            },
            data: {
              type: "user",
              id: result.mail,
              attribute:{
                prenom: result.prenom,
                role: role,
                nom: result.nom,
                adresse: result.adresse,
                telephone: result.telephone
              }
            }
          };
          res.status(200);
          res.json(dbUserObj);
          return
        }
      }
    }
  });
},

insert: function(username, password,nom,prenom,adresse,tel,callback) {
  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('INSERT INTO utilisateur VALUES ($1,$2,$3,$4,$5,$6,$7)',[username,nom,prenom,adresse,tel,password,false], function(err, result) {
      //call `done()` to release the client back to the pool
      done();

      if(err) {
        callback("errorDB");
        return;
      }
      else {
        client.query('SELECT mail,isadmin,prenom FROM utilisateur WHERE mail=($1)',[username], function(err, result) {
          done();

          if(err) {
            callback("errorDB");
            return;
          }
          else {
            callback(result.rows[0]);
            return;
          }
        });
      }
    });
  });
},

update: function(req, res) {
  var username = req.params.id;
  var admin = req.body.admin || '';

  if (username == '') {
    res.status(401);
    res.json({
      "status": 401,
      "message": "Invalid credentials"
    });
    return;
  }

  if(admin== '')
  {
    admin=false;
  }

  var dbUserObj={};
  users.updateAdmin(username,admin,function(result){
    if (!result) { // If authentication fails, we send a 401 back
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }
    else{
      if (result=="errorDB") { // If authentication fails, we send a 401 back
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
          dbUserObj = {
            link: {
              self:"/api/v1/admin/user"
            },
            data: {
              type: "user",
              id: result.mail,
              attribute:{
                prenom: result.prenom,
                role: role,
                nom: result.nom,
                adresse: result.adresse,
                telephone: result.telephone
              }
            }
          };
          res.status(200);
          res.json(dbUserObj);
          return
        }
      }
    }

  });
},

updateProfil: function(req, res) {
  var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
  var decoded = jwt.decode(token, require('../config/secret.js')());
  var username = decoded.id;
  var password = req.body.password || '';
  var nom = req.body.nom || '';
  var prenom= req.body.prenom || '';
  var adresse = req.body.adresse || '';
  var tel = req.body.telephone || '';

  if (password == '' || nom == '' || prenom == '' || adresse == '' || tel == '') {
    res.status(401);
    res.json({
      "status": 401,
      "message": "Invalid credentials"
    });
    return;
  }
  password = crypto.createHmac('sha256', seed).update(password).digest('hex');
  var dbUserObj={};
  users.updateUser(username,password,nom,prenom,adresse,tel,function(result){
    if (!result) { // If authentication fails, we send a 401 back
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }
    else{
      if (result=="errorDB") { // If authentication fails, we send a 401 back
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
          dbUserObj = {
            link: {
              self:"/api/v1/user"
            },
            data: {
              type: "user",
              id: result.mail,
              attribute:{
                prenom: result.prenom,
                role: role,
                nom: result.nom,
                adresse: result.adresse,
                telephone: result.telephone
              }
            }
          };
          res.status(200);
          res.json(dbUserObj);
          return;
        }
      }
    }

  });
},

updateUser: function(username,password,nom,prenom,adresse,tel,callback) {
  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('UPDATE utilisateur SET nom=($2),prenom=($3),adresse=($4),telephone=($5),mdp=($6) WHERE mail=($1)',[username,nom,prenom,adresse,tel,password], function(err, result) {
      //call `done()` to release the client back to the pool
      done();

      if(err) {
        callback("errorDB");
        return;
      }
      else {
        client.query('SELECT * FROM utilisateur WHERE mail=($1)',[username], function(err, result) {
          done();

          if(err) {
            callback("errorDB");
            return;
          }
          else {
            callback(result.rows[0]);
            return;
          }
        });
      }
    });
  });
},

updateAdmin: function(username,admin,callback) {
  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('UPDATE utilisateur SET isadmin=($2) WHERE mail=($1)',[username,admin], function(err, result) {
      //call `done()` to release the client back to the pool
      done();

      if(err) {
        callback("errorDB");
        return;
      }
      else {
        client.query('SELECT * FROM utilisateur WHERE mail=($1)',[username], function(err, result) {
          done();

          if(err) {
            callback("errorDB");
            return;
          }
          else {
            callback(result.rows[0]);
            return;
          }
        });
      }
    });
  });
},


delete: function(req, res) {
  var id = req.params.id;
  if (id == '') {
    res.status(401);
    res.json({
      "status": 401,
      "message": "Invalid credentials"
    });
    return;
  }
  users.deleteUser(id,function(result){
    if (!result) { // If authentication fails, we send a 401 back
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }
    else{
      if (result=="errorDB") { // If authentication fails, we send a 401 back
        res.status(501);
        res.json({
          "status": 501,
          "message": "Error on database"
        });
        return;
      }
      else {
        if (result=="userDeleted") {
          res.status(200);
          res.json({
            "status": 200,
            "message": "Utilisateur "+id+" a été supprimé"
          });
          return;
        }
      }
    }

  });
},

deleteProfil: function(req, res) {
  var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
  var decoded = jwt.decode(token, require('../config/secret.js')());
  var id = decoded.id;
  if (id == '') {
    res.status(401);
    res.json({
      "status": 401,
      "message": "Invalid credentials"
    });
    return;
  }
  users.deleteUser(id,function(result){
    if (!result) { // If authentication fails, we send a 401 back
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }
    else{
      if (result=="errorDB") { // If authentication fails, we send a 401 back
        res.status(501);
        res.json({
          "status": 501,
          "message": "Error on database"
        });
        return;
      }
      else {
        if (result=="userDeleted") {
          res.status(200);
          res.json({
            "status": 200,
            "message": "Utilisateur "+id+" a été supprimé"
          });
          return;
        }
      }
    }

  });
},

deleteUser: function(username,callback) {
  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('DELETE FROM utilisateur WHERE mail=($1)',[username], function(err, result) {
      //call `done()` to release the client back to the pool
      done();

      if(err) {
        callback("errorDB");
        return;
      }
      else {
        callback("userDeleted");
        return;
      }

    });

  });

}
};
module.exports = users;
