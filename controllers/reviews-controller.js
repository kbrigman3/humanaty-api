var firebase = require('firebase');
require('firebase/auth');
require('firebase/firestore');
var db = require('../routes/firebase'); //get reference to firebase config file
var database = firebase.firestore(db.app); //declare database using app initialization in firebase.js
var reviewCollection = database.collection("reviews"); //reference to the reviews collection of our database


//TODO: implement create review logic here
exports.createReview = function(req, res, next) {
    console.log("API working for review page");
    createNewReview(req.body.date, req.body.rating, req.body.reviewBody,
                    req.body.reviewedAsHost, req.body.reviewee, req.body.reviewer); 
    res.send("Review created!");                
  }

exports.getReviewById = function(req, res, next) {

    //TODO: Uncomment these lines to authenticate user first. Check with Zach or Andrew
    // firebase.auth().onAuthStateChanged((user) => {
    //     if (user) {
            let uid = req.params.id;
            reviewCollection.doc(uid)
                .get()
                .then( doc => {      
                    let { id } = doc;
                    let data = doc.data();

                    //this line manually add the id to the result object since Firebase data doesnt not include id.
                    let result = { id, ...data };

                    //return response
                    res.send(result);  
                })
                .catch(err => {
                    console.log('Error getting review data', err);
                });
          
    //     } else {
    //       console.log("No user logged in");  
    //       res.send("Error getting user data");
    //     }
    //  });
};

function createNewReview(date, rating, reviewBody, reviewedAsHost, reviewee, reviewer) {
    console.log("createNewReview called");
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.

          var newReviewRef = database.collection("reviews").doc();
          var newReviewId = newReviewRef.id;

          //Append this review to the reviewee's list of reviews
          var userRef = database.collection("users").doc(reviewee);
          userRef.update({
            reviews:   firebase.firestore.FieldValue.arrayUnion(newReviewId) 
          })
            
          
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
