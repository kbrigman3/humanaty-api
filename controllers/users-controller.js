var firebase = require('firebase');
require('firebase/auth');
require('firebase/firestore');
var db = require('../routes/firebase'); //get reference to firebase config file
var database = firebase.firestore(db.app); //declare database using app initialization in firebase.js
var userCollection = database.collection("users"); //reference to the users collection of our database

exports.changeUserStatus = function(req, res, next) {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            //User exists, get user id
            var uid = user.uid; 
            //Find specific user in the users collection based on their User ID
            if (userCollection.doc(uid).get().then(function(doc) {
                var data = doc.data(); //object containing data fields of this user
                if (data.hostVerified) { //if user is host
                    userCollection.doc(uid).update( { //change status to guest
                        hostVerified: false
                    }) 
                } else {
                    userCollection.doc(uid).update( {
                        hostVerified: true
                    }) 
                }
                
                res.send("status changed!")
            }));
          
        } else {
          console.log("no user logged in");  
          res.send("Error getting user data");
        }
     });
};

exports.getUserById = function(req, res, next) {

    //TODO: Uncomment these lines to authenticate user first. Check with Zach or Andrew
    // firebase.auth().onAuthStateChanged((user) => {
    //     if (user) {
            let uid = req.params.id;
            userCollection.doc(uid)
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
                    console.log('Error retreiving user data from database', err);
                });
          
    //     } else {
    //       console.log("No user logged in");  
    //       res.send("Error getting user data");
    //     }
    //  });
};

exports.getCurrentUser = function(req, res, next) {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            let uid = user.uid;
            userCollection.doc(uid)
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
                    console.log('Error retreiving currently logged in user data from database', err);
                });
        } else {
          console.log("No user logged in");  
          res.send("Error getting logged in user data");
        }
     });
};

exports.logOut = function(req, res, next) {
   //sign user out
   firebase.auth().signOut().then(function() {
    res.send("Logged out!"); //the res.sends will be printed in front end console
   }, function(error) {
       console.error('sign out error', error);
       res.send("Logout error!");
   })  
};