var firebase = require('firebase');
require('firebase/auth');
require('firebase/firestore');
var db = require('./firebase'); //get reference to firebase config file

var express = require('express');
var router = express.Router();


var database = firebase.firestore(db.app); //declare database using app initialization in firebase.js

//DEPRECATED - MOVED TO reviews-controller, 3/31/2020

function createNewReview(date, rating, reviewBody, reviewedAsHost, reviewee, reviewer) {
    console.log("createNewReview called");
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.

          var newReviewRef = database.collection("reviews").doc();
          var newReviewId = newReviewRef.id;
          
          let setDoc = database.collection("reviews").doc(newReviewId).set({
            date: date,
            rating: rating,
            reviewBody: reviewBody,
            reviewedAsHost: reviewedAsHost,
            reviewee: reviewee,
            reviewer: reviewer
          });
          return setDoc.then(function() {
            console.log("Document successfully written for review!");
          });
  
        } else {
          // User is signed out.
          // ...
        }
    
      }); 
}

router.post('/', function(req, res, next) {
    console.log("API working for review page");
    createNewReview(req.body.date, req.body.rating, req.body.reviewBody,
                    req.body.reviewedAsHost, req.body.reviewee, req.body.reviewer); 
    res.send("Review created!");                
  });

module.exports = router;