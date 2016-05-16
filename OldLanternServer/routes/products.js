var pg = require("pg");
var conString = require('../config/database').url;


var products = {
  getAll: function(req, res) {
    var dbUserObj={};
    products.selectAll(function(results){
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
                type: "products",
                id: result.numeroart,
                attribute:{
                  nom: result.nom,
                  description: result.description,
                  prix: result.prix,
                  nbExemp: result.nbexempstock,
                  img: result.cheminimg,
                },
                relationships:{
                  typeproduct: {
                    links: {
                      self: "/api/v1/typeproduct/"+result.typearticle

                    },
                    data: {
                      type: "typeproduct",
                      id: result.typearticle,
                      attribute:{
                        libelle:result.libelle
                      }
                    }
                  }
                }
              });
            });
            dbUserObj = {
              link: {
                self:"/api/v1/products"
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
      client.query('SELECT * FROM article,typearticle WHERE typearticle=numerotype', function(err, result) {
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
    products.selectOne(id,function(result){
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
            var infos =[];
            infos.push({
              type: "products",
              id: result.numeroart,
              attribute:{
                nom: result.nom,
                description: result.description,
                prix: result.prix,
                nbExemp: result.nbexempstock,
                img: result.cheminimg,
              },
              relationships:{
                typeproduct: {
                  links: {
                    self: "/api/v1/typeproduct/"+result.typearticle

                  },
                  data: {
                    type: "typeproduct",
                    id: result.typearticle,
                    attribute:{
                      libelle:result.libelle
                    }
                  }
                }
              }
            });
            dbUserObj = {
              link: {
                self:"/api/v1/product/"+result.numeroart
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

  selectOne: function(id,callback) {
    pg.connect(conString, function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query('SELECT * FROM article,typearticle WHERE typearticle=numerotype AND numeroart=($1)',[id], function(err, result) {
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
    var nom = req.body.nom || '';
    var prix = req.body.prix || '';
    var desc = req.body.description || '';
    var nbEx= req.body.nbExemplaire || '';
    var img = req.body.img || '';
    var idType = req.body.typeart || '';

    if (nom == '' || prix == '' || desc == '' || nbEx == '' || img == '' || idType == '') {
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }
    var dbUserObj={};
    products.insert(nom,prix,desc,nbEx,img,idType,function(result){
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
                self:"/api/v1/product/"+result.numeroart
              },
              data: {
                type: "user",
                id: result.numeroart,
                attribute:{
                  nom: result.nom,
                  description: result.description,
                  prix: result.prix,
                  nbExemp: result.nbexempstock,
                  img: result.cheminimg
                }
              },
              relationships:{
                typeproduct: {
                  links: {
                    self: "/api/v1/typeproduct/"+result.typearticle

                  },
                  data: {
                    type: "typeproduct",
                    id: result.typearticle,
                    attribute:{
                      libelle:result.libelle
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

  insert: function(nom,prix,desc,nbExemp,img,idType,callback) {
    pg.connect(conString, function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query('INSERT INTO article VALUES (DEFAULT,$1,$3,$2,$4,$5,$6) RETURNING numeroart',[nom,prix,desc,nbExemp,img,idType], function(err, result) {
        //call `done()` to release the client back to the pool
        done();

        if(err) {
          callback("errorDB");
          return;
        }
        else {
          client.query('SELECT * FROM article,typearticle WHERE typearticle=numerotype AND numeroart=($1)',[result.rows[0].numeroart], function(err, result) {
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
        }
      });
    });
  },

  update: function(req, res) {
    var id = req.params.id;
    var nom = req.body.nom || '';
    var prix = req.body.prix || '';
    var desc = req.body.description || '';
    var nbEx= req.body.nbExemplaire || '';
    var img = req.body.img || '';
    var idType = req.body.typeart || '';

    if (id== '' ||nom == '' || prix == '' || desc == '' || nbEx == '' || img == '' || idType == '') {
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }
    var dbUserObj={};
    products.updateProduct(id,nom,prix,desc,nbEx,img,idType,function(result){
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
                self:"/api/v1/product/"+result.numeroart
              },
              data: {
                type: "user",
                id: result.numeroart,
                attribute:{
                  nom: result.nom,
                  description: result.description,
                  prix: result.prix,
                  nbExemp: result.nbexempstock,
                  img: result.cheminimg
                }
              },
              relationships:{
                typeproduct: {
                  links: {
                    self: "/api/v1/typeproduct/"+result.typearticle

                  },
                  data: {
                    type: "typeproduct",
                    id: result.typearticle,
                    attribute:{
                      libelle:result.libelle
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

  updateQte: function(req, res) {
    var id = req.params.id;
    var qte = req.body.quantite || '';

    if (id== '' ||qte == '') {
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }
    var dbUserObj={};
    products.updateQuantity(id,qte,function(result){
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
                self:"/api/v1/product/"+result.numeroart
              },
              data: {
                type: "user",
                id: result.numeroart,
                attribute:{
                  nom: result.nom,
                  description: result.description,
                  prix: result.prix,
                  nbExemp: result.nbexempstock,
                  img: result.cheminimg
                }
              },
              relationships:{
                typeproduct: {
                  links: {
                    self: "/api/v1/typeproduct/"+result.typearticle

                  },
                  data: {
                    type: "typeproduct",
                    id: result.typearticle,
                    attribute:{
                      libelle:result.libelle
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

  updateProduct: function(id,nom,prix,desc,nbExemp,img,idType,callback) {
    pg.connect(conString, function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query('UPDATE article SET nom=($1),description=($3),prix=($2),nbexempstock=($4),cheminimg=($5),typearticle=($6) WHERE numeroart=($7)',[nom,prix,desc,nbExemp,img,idType,id], function(err, result) {
        //call `done()` to release the client back to the pool
        done();

        if(err) {
          callback("errorDB");
          return;
        }
        else {
          client.query('SELECT * FROM article,typearticle WHERE typearticle=numerotype AND numeroart=($1)',[id], function(err, result) {
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
        }
      });
    });
  },

  updateQuantity: function(id,quantite,callback) {
    pg.connect(conString, function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query('UPDATE article SET nbexempstock=($1)  WHERE numeroart=($2)',[quantite,id], function(err, result) {
        //call `done()` to release the client back to the pool
        done();

        if(err) {
          callback("errorDB");
          return;
        }
        else {
          client.query('SELECT * FROM article,typearticle WHERE typearticle=numerotype AND numeroart=($1)',[id], function(err, result) {
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
        }
      });
    });
  }

};
module.exports = products;
