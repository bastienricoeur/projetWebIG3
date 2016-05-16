var pg = require("pg");
var conString = require('../config/database').url;

var prodtypes= {

  getAll: function(req,res){
    var dbUserObj={};
    prodtypes.selectAll(function(results){
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
              infos.push({
                type: "typeproduct",
                id: result.numerotype,
                attribute:{
                  libelle: result.libelle
                }

              });
            });
            dbUserObj = {
              link: {
                self:"/api/v1/prodtypes"
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

  selectAll: function(callback) {
    pg.connect(conString, function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query('SELECT * FROM typearticle', function(err, result) {
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

  getOne: function(req,res){
    var id = req.params.id;
    if (id== '') {
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }
    var dbUserObj={};
    prodtypes.selectOne(id,function(result){
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
            dbUserObj = {
              link: {
                self:"/api/v1/prodtype"+result.numerotype
              },
              data: {
                type: "typearticle",
                id: result.numerotype,
                attribute:{
                  libelle: result.libelle
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

  selectOne: function(numero,callback) {
    pg.connect(conString, function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query('SELECT * FROM typearticle WHERE numerotype=($1)', [numero],function(err, result) {
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
  }


}
module.exports = prodtypes;
