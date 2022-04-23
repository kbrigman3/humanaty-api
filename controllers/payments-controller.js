var firebase = require('firebase');
require('firebase/auth');
require('firebase/firestore');
var db = require('../routes/firebase'); //get reference to firebase config file
var database = firebase.firestore(db.app); //declare database using app initialization in firebase.js


const stripe = require('stripe')('sk_test_lS2QxRwja9PCY1KlEDOOOUXU002RHOQJpJ');


exports.createPayment = async function(req, res, next) {
    var amount = req.body.amount;
    var guest_num = req.body.guest_num;
    var cost = req.body.cost;
    try {
      if ((guest_num * cost) == amount) {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount * 100,
          currency: 'usd',
          // Verify your integration in this guide by including this parameter
          metadata: {integration_check: 'accept_a_payment'},
        });
        var res_object = {client_secret: paymentIntent.client_secret, intent_id: paymentIntent.id};
        res.send(res_object);
      } else {
        console.log('failure');
      }
    } catch {
      console.log('failure');
    }
}