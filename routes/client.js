var express = require('express');
var router = express.Router();
var User = require('../models/user');
var mongoose = require('mongoose');
var userdata;

/* Get member page. */
router.get('/', function(req, res, next) {
  if(req.cookies.logged){
    var uid = req.cookies.logged;
    var query = User.findOne({ '_id' : uid });
    query.select('name email money card image_url');
    query.exec(function (err, user) {
  //  if (err) return handleError(err);
      userdata=user;
      res.render('client', { userdata: user, title: 'client', action:'MAIN' });
    });
  } else {
    res.redirect('/login');
  }
});
router.get('/withdraw', function(req, res, next) {
  res.render('client', { action: 'WITHDRAW', userdata: userdata, title: 'Withdraw' });
});
router.get('/deposit', function(req, res, next) {
  res.render('client', { action: 'DEPOSIT', userdata: userdata, title: 'Deposit' });
});
router.get('/logout', function(req, res, next) {
  res.clearCookie("logged");
  res.redirect('/login');
});
router.get('/bank', function(req, res, next) {
  res.send('it goes to get');
});
router.post('/bank', function(req, res, next) {
  console.log('Transaction In progress');
  var amount = req.body.amount;
  var card = req.body.card;
  var action = req.body.action;
  console.log(amount+' '+card+' '+action);
    if(action=='DEPOSIT'){
      var newAmount = (parseInt(amount) + parseInt(userdata.money)).toString();
      var deposit = User.updateOne(
      { 'card' : card },
      { $set: { 'money' : newAmount } }
      );
      deposit.exec(function (err, result) {
    //  if (err) return handleError(err);
        console.log(result);
      });
    };
    if(action=='WITHDRAW'){
      var newAmount = parseInt(userdata.money) - parseInt(amount);
      if(newAmount<0){res.redirect('/client'); return;}
      var withdraw = User.updateOne(
      { 'card' : card },
      { $set: { 'money' : newAmount } }
      );
      withdraw.exec(function (err, result) {
      // if (err) return handleError(err);
        console.log(result);
      });
    };
    res.redirect('/client');
});
module.exports = router;
