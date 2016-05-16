var jwt = require('jwt-simple');
var pg = require("pg");
var conString = require('../config/database').url;

var carts= {

  getAll: function(req,res){
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
    carts.selectAll(id,function(results){
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
                type: "carts",
                id: result.numerocb,
                attribute:{
                  dateexpiration: result.dateexpiration,
                  titulaire: result.titulaire,
                  pictogramme: result.pictogramme,
                  banque: result.banque
                },
                relationships:{
                  user: {
                    link: {
                      self:"/api/v1/admin/user/"+result.mail
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
                  }
                }
              });
            });
            dbUserObj = {
              link: {
                self:"/api/v1/carts"
              },
              data: infos
            };
            res.status(200);
            res.json(dbUserObj);
            return;
          }
        }
      }
    });
  },

  selectAll: function(username,callback) {
    pg.connect(conString, function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query('SELECT * FROM CarteBleue c, ProprietaireCarte p, Utilisateur u WHERE c.numeroCB=p.numeroCB AND p.mail=u.mail AND u.mail=($1)',[username], function(err, result) {
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

  create: function(req, res){
    var numero = req.body.numero || '';
    var date = req.body.date || '';
    var titulaire = req.body.titulaire || '';
    var picto = req.body.pictogramme || '';
    var banque= req.body.banque || '';
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    var decoded = jwt.decode(token, require('../config/secret.js')());
    var id = decoded.id;

    if (numero == ""||date == ""|| titulaire == "" ||picto == ""||banque == ""||id == "") {
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }
    var dbUserObj={};
    carts.insert(numero,date,titulaire,picto,banque,id,function(result){
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
                self:"/api/v1/cart"
              },
              data: {
                type: "cart",
                id: result.numerocb,
                attribute:{
                  dateexpiration: result.dateexpiration,
                  titulaire: result.titulaire,
                  pictogramme: result.pictogramme,
                  banque: result.banque
                },
                relationships:{
                  user: {
                    link: {
                      self:"/api/v1/admin/user/"+result.mail
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
                  }
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

  insert: function(numero,date,titulaire,pictogramme,banque,username,callback) {
    pg.connect(conString, function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query('INSERT INTO cartebleue VALUES ($1,$2,$3,$4,$5)',[numero,date,titulaire,pictogramme,banque], function(err, result) {
        //call `done()` to release the client back to the pool
        done();

        if(err) {
          callback("errorDB");
          return;
        }
        else {
          client.query('INSERT INTO proprietairecarte VALUES ($1,$2)',[numero,username], function(err, result) {
            done();

            if(err) {
              callback("errorDB");
              return;
            }
            else {
              client.query('SELECT * FROM CarteBleue c, ProprietaireCarte p, Utilisateur u WHERE c.numeroCB=p.numeroCB AND p.mail=u.mail AND c.numeroCB=($1) AND u.mail=($2)',[numero,username], function(err, result) {
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
        }
      });
    });
  },

  delete: function(req,res)
  {
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    var decoded = jwt.decode(token, require('../config/secret.js')());
    var id = decoded.id;
    var numero = req.params.id;
    if (numero == '' || id== '') {
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }
    carts.deleteCart(numero,id,function(result){
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
          if (result=="cartDeleted") {
            res.status(200);
            res.json({
              "status": 200,
              "message": "Carte Bleue numéro "+id+" a été supprimée"
            });
            return;
          }
        }
      }

    });
  },

  deleteCart: function(numeroCB,username,callback) {
    pg.connect(conString, function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query('DELETE FROM proprietairecarte WHERE numeroCB=($1) AND mail=($2)',[numeroCB,username], function(err, result) {
        //call `done()` to release the client back to the pool
        done();

        if(err) {
          callback("errorDB");
          return;
        }
        else {
          callback("cartDeleted");
          return;
        }

      });

    });

  }

};
module.exports = carts;
