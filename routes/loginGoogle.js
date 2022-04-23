var firebase = require('firebase');
require('firebase/auth');
require('firebase/firestore');
var db = require('./firebase'); //get reference to firebase config file

var express = require('express');
var router = express.Router();

var database = firebase.firestore(db.app); //declare database using app initialization in firebase.js

function signInGoogleUser(id_token, name, email, DOB) {    
    // Build Firebase credential with the Google ID token.
    var credential = firebase.auth.GoogleAuthProvider.credential(id_token);

    // Sign in with credential from the Google user.
    firebase.auth().signInWithCredential(credential).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
        console.log(errorMessage);
    });

    //Use on Auth State Changed to detect current user, fetch user id, and add additional data to database
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log(user);
            // User is signed in.
            //Now that user is created, find their ID
            var user = firebase.auth().currentUser;
            var uid = user.uid; 
            // Add a new document in collection "users" using this user's ID
            console.log(uid);

            var dataRef = database.collection("users").doc(uid);
            dataRef.get().then(function(doc) {
                //check if the user data already exists to prevent overwrite
                if(!doc.exists) {
                    dataRef.set({
                        aboutMe: "Default about section - figure out what should say later.",
                        allergies: [], //users will be able to populate this with their allergies
                        birthday: DOB.toString(), //find out how to get google DOB later
                        displayName: name,
                        email: email,
                        eventsAttending: [],
                        eventsHosting: [],
                        eventsAttended: [],
                        eventsHosted: [],
                        guestRating: null,
                        hostRating: null,
                        hostVerified: false,
                        location: { //figure out how to get user location automatically?
                        address: null,
                        city: null,
                        state: null,
                        zip: null
                        },
                        reviews: [],
                        photoURL: "https://i.kym-cdn.com/photos/images/newsfeed/001/207/210/b22.jpg",
                        uid: uid
                    })
                    .then(function() {
                        console.log("Document successfully written!");
                    })
                    .catch(function(error) {
                        console.error("Error writing document: ", error);
                    })
                } else {
                    //Data already exists, no need to write
                }
            })
        }  else {
            // No user is signed in.
        }
      });
    
}



router.post('/', function(req, res, next) {
    // console.log(req);
    // loginUser(req.body.email, req.body.password); 
    console.log(req)
    signInGoogleUser(req.body.token, req.body.name, req.body.email, req.body.DOB);
});

  
  

module.exports = router;