var firebase = require('firebase');
require('firebase/auth');
require('firebase/firestore');
var db = require('./firebase'); //get reference to firebase config file

var express = require('express');
var router = express.Router();


var database = firebase.firestore(db.app); //declare database using app initialization in firebase.js

function createNewUser(email, password, name, DOB) {
  /* firebase.auth.signout Will be deprecated in the future, just using this to prevent dupe sign ins until we have
  the view actually changing with the user's auth status */
  firebase.auth().signOut();

  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here. ***Currently an error is being allowed, it may overwrite user data if an improperly formatted email is
    //submitted. Will be fixed when we have form validation tho
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorMessage);
    // ...
  });

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log(user);
        // User is signed in.
        //Now that user is created, find their ID
        var user = firebase.auth().currentUser;
        var uid = user.uid;
        // Add a new document in collection "users" using this user's ID
        database.collection("users").doc(uid).set({
            aboutMe: "Default about section - figure out what should say later.",
            allergies: [], //users will be able to populate this with their allergies
            birthday: DOB.toString(),
            displayName: name,
            email: email,
            eventsAttending: [],
            eventsHosting: [],
            eventsAttended: [],
            eventsHosted: [],
            guestRating: 0,
            hostRating: 0,
            hostVerified: false,
            location: { //figure out how to get user location automatically?
              address: null,
              city: null,
              state: null,
              zip: null,
              geopoint: {}
            },
            reviews: [],
            photoURL: "https://i.kym-cdn.com/photos/images/newsfeed/001/207/210/b22.jpg",
            uid: uid

        })
        .then(function() {
            console.log("Document successfully written!");
            // window.location.assign("../../index.html");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        })
    }  else {
        // No user is signed in.
    }
  });
} 

//get user creation request
router.post('/', function(req, res, next) {
  console.log(req.body.email);
  createNewUser(req.body.email, req.body.password, req.body.name, req.body.DOB); 
});


module.exports = router;
