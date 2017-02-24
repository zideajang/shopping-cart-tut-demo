var express = require('express');
var router = express.Router();

var Product = require('../models/product');

router.get('/', function(req, res, next) {
  Product.find(function(err,docs){
    var productChucks = [];
    var chuckSize = 3;
    for (var index = 0; index < docs.length; index+=chuckSize) {
      productChucks.push(docs.slice(index,index + chuckSize));
    }
    res.render('shop/index', { title: '购物车',products:productChucks });
  })
  
});


module.exports = router;
