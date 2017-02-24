var Product = require('../models/product');
var mongoose = require('mongoose');
mongoose.connect('localhost:27017/shopping');

var products = [
    new Product({
        imagePath:'painting_africahunter.png',
        title:"非洲猎人",
        description:"非洲猎人",
        price:120
    }),
    new Product({
        imagePath:'painting_alian.png',
        title:"外星人",
        description:"外星人",
        price:150
    }),
    new Product({
        imagePath:'painting_crocodilia.png',
        title:"小鳄鱼",
        description:"小鳄鱼",
        price:180
    }),
    new Product({
        imagePath:'painting_monster.png',
        title:"小怪兽",
        description:"小怪兽",
        price:220
    }),
    new Product({
        imagePath:'painting_mountain.png',
        title:"游戏风景",
        description:"游戏风景",
        price:120
    }),
    new Product({
        imagePath:'painting_warrior.png',
        title:"战士",
        description:"战士",
        price:280
    })
]

var done = 0;

for(var i = 0; i < products.length; i++){
    products[i].save(function(err,result){
        done++;
        if(done === products.length){
            exit();
        }
    });
}

function exit(){
    mongoose.disconnect();
}