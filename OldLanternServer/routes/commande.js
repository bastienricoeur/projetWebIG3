var jwt = require('jwt-simple');
var pg = require("pg");
var conString = require('../config/database').url;

var commande= {
  create: function(req, res) {
    var date = req.body.date || '';
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    var decoded = jwt.decode(token, require('../config/secret.js')());
    var id = decoded.id;


    if (date == '' || id == '') {
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }
    var dbUserObj={};
    commande.insert(date,id,function(result){
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
                self:"/api/v1/commande/"+result.numerocom
              },
              data: {
                type: "commande",
                id: result.numerocom,
                attribute:{
                  date: result.datecom
                }
              },
              relationships:{
                user: {
                  links: {
                    self: "/api/v1/admin/user/"+result.mail

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
            };
            res.status(200);
            res.json(dbUserObj);
            return
          }
        }
      }
    });
  },

  insert: function(date,username,callback) {
    pg.connect(conString, function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query('INSERT INTO commande VALUES (DEFAULT,$1,$2) RETURNING numerocom',[date,username], function(err, result) {
        //call `done()` to release the client back to the pool
        done();

        if(err) {
          callback("errorDB");
          return;
        }
        else {
          client.query('SELECT * FROM commande c,utilisateur u WHERE c.mail=u.mail AND numerocom=($1)',[result.rows[0].numerocom ], function(err, result) {
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

  createContenu: function(req, res) {
    var numerocom = req.body.numerocom || '';
    var numeroart = req.body.numeroart || '';
    var qte = req.body.quantite || '';

    if (numerocom == '' || qte == '' || numeroart == '') {
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }
    var dbUserObj={};
    commande.insertContenu(numerocom,numeroart,qte,function(result){
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
              data: {
                type: "contenucommande",
                attribute:{
                  mail: result.mail,
                  numerocom: result.numerocom,
                  quantite: result.quantite
                }
              },
              relationships:{
                product: {
                  links: {
                    self: "/api/v1/product/"+result.numeroart

                  },
                  data: {
                    type: "products",
                    id: result.numeroart,
                    attribute:{
                      nom: result.nom,
                      description: result.description,
                      prix: result.prix,
                      nbExemp: result.nbexempstock,
                      img: result.cheminimg,
                    }
                  },
                  commande: {
                    links: {
                      self: "/api/v1/commande/"+result.numerocom

                    },
                    data: {
                      type: "commande",
                      id: result.numerocom,
                      attribute:{
                        date: result.datecom
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

  insertContenu: function(numerocom,numeroart,qte,callback) {
    pg.connect(conString, function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query('INSERT INTO contenucommande VALUES ($1,$2,$3)',[numerocom,numeroart,qte], function(err, result) {
        //call `done()` to release the client back to the pool
        done();

        if(err) {
          callback("errorDB");
          return;
        }
        else {
          client.query('SELECT * FROM commande c, article a WHERE c.numerocom=($1) AND a.numeroart=($2)',[numerocom,numeroart], function(err, result) {
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
    commande.selectOne(id,function(results){
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
                quantite: result.quantite,
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
                self:"/api/v1/commande/"+results[0].numerocom
              },
              data: {
                type: "commande",
                id: results[0].numerocom,
                attribute:{
                  date: results[0].datecom,
                  user: results[0].mail
                },
                relationships : infos
              }
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
      client.query('SELECT * FROM commande c,contenucommande cc,article a,typearticle t WHERE c.numerocom=cc.numerocom AND cc.numeroart=a.numeroart AND a.typearticle=t.numerotype AND c.numerocom=($1)',[id], function(err, result) {
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

  createFacture: function(req, res) {
    var numerocom = req.body.numerocom || '';
    var numerocb = req.body.numerocb || '';
    var adresse = req.body.adresseLivraison || '';


    if (numerocom == '' || numerocb == '' || adresse == '') {
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }
    var dbUserObj={};
    commande.insertFacture(numerocom,numerocb,adresse,function(result){
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
                self:"/api/v1/facture/"+result.numerofac
              },
              data: {
                type: "facture",
                id: result.numerofac,
                attribute:{
                  prix: result.prixtotal,
                  adresseLivraison: result.adresseLivraison,
                  numeroCB: result.numeroCB
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

  insertFacture: function(numerocom,numerocb,adresse,callback) {
    pg.connect(conString, function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query('INSERT INTO facture VALUES (DEFAULT,$1,0,$2,$3) RETURNING numerofac',[adresse,numerocb,numerocom], function(err, result) {
        //call `done()` to release the client back to the pool
        done();

        if(err) {
          callback("errorDB");
          return;
        }
        else {
          client.query('SELECT * FROM facture WHERE numerofac=($1)',[result.rows[0].numerofac], function(err, result) {
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


}
module.exports = commande;
