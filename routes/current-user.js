var firebase = require('firebase');
require('firebase/auth');
require('firebase/firestore');
var db = require('./firebase'); //get reference to firebase config file

var express = require('express');
var router = express.Router();

var database = firebase.firestore(db.app); //declare database using app initialization in firebase.js
var userCollection = database.collection("users"); //reference to the users collection of our database

// /**
//  * This has been moved to getCurrentUser in users-controller.js
//  * //TODO: remove this method after updating front end api call. Should call /user/current
//  ** 
router.get('/', function(req, res, next) {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            //User exists, get user id
            var uid = user.uid; 
            //Find specific user in the users collection based on their User ID
            if (userCollection.doc(uid).get().then(function(doc) {
                var data = doc.data(); //object containing data fields of this user
                /* create object containing the user data we want, for now email, name, and status*/
                var obj = {name: data.displayName, email: data.email, hostVerified: data.hostVerified, aboutMe: data.aboutMe,
                    allergies: data.allergies, birthday: data.birthday, eventsAttending: data.eventsAttending, 
                    eventsHosting: data.eventsHosting, guestRating: data.guestRating, hostRating: data.hostRating,
                    location: data.location, eventsAttended: data.eventsAttended, eventsHosted: data.eventsHosted, 
                    photoURL: data.photoURL, uid: data.uid}
                //this is superfluous ^^^, don't know what I was thinking here. Returning the data variable I just declared 
                //would be the same as returning this massive object 
                res.send(data) //send user data back to front end
            }));
          
        } else {
          console.log("no user logged in");  
          res.send("Error getting user data");
        }
     });
})

module.exports = router;