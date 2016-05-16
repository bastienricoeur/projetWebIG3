var express = require('express');
var router = express.Router();
var auth = require('./auth.js');
var products = require('./products.js');
var user = require('./users.js');
var carts = require('./carts.js');
var prodtypes = require('./prodtypes.js');
var commande = require('./commande.js');

/*
* Routes accesibles sans être connecter
*/
router.post('/login', auth.login);
router.post('/subscribe', user.create);
/*
* Routes accessible en étant connecté en tant qu'utilisateur
*/
router.get('/api/v1/products/', products.getAll);
router.get('/api/v1/product/:id', products.getOne);
router.get('/api/v1/user/', user.getProfil);
router.put('/api/v1/user/', user.updateProfil);
router.delete('/api/v1/user/', user.deleteProfil);
router.get('/api/v1/carts/', carts.getAll);
router.post('/api/v1/cart/',carts.create);
router.delete('/api/v1/cart/:id', carts.delete);
router.get('/api/v1/prodtypes/', prodtypes.getAll);
router.get('/api/v1/prodtype/:id', prodtypes.getOne);
router.get('/api/v1/commande/:id', commande.getOne);
router.post('/api/v1/commande/', commande.create);
router.post('/api/v1/contenucommande/', commande.createContenu);
router.post('/api/v1/facture/', commande.createFacture);

/*
* Routes accessible en étant connecté en tant qu'administrateur
*/
router.post('/api/v1/admin/product/', products.create);
router.put('/api/v1/admin/product/:id', products.update);
router.put('/api/v1/admin/product/qte/:id', products.updateQte);
router.get('/api/v1/admin/users/', user.getAll);
router.get('/api/v1/admin/user/:id', user.getOne);
router.put('/api/v1/admin/user/:id', user.update);
router.delete('/api/v1/admin/user/:id', user.delete);
module.exports = router;
