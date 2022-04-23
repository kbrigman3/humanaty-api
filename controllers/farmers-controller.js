var firebase = require('firebase');
require('firebase/auth');
require('firebase/firestore');
var db = require('../routes/firebase'); //get reference to firebase config file
var database = firebase.firestore(db.app); //declare database using app initialization in firebase.js
var farmerCollection = database.collection("farmers"); //reference to the event collection of our database


/**
 * Search farmers by city or title
 * usage: /http://localhost:9000/farmers?city=Atlanta
 * everything is Case Sentitive!
 */
exports.getFarmersByCriteria = function(req, res, next) {

    //TODO: Make sure we have Farmer's records in Firestore in similar fashion we have it in Events. 
    //Especially for Location field.

    //TODO: Uncomment these lines to authenticate user first. Check with Zach or Andrew
    // firebase.auth().onAuthStateChanged((user) => {
    //     if (user) {

            let filter = '';
            let value = '';

            let farmerList = []; 

            if (typeof req.query.city != 'undefined') {
                filter = 'location.city';
                value = req.query.city;
            } else if (typeof req.query.title != 'undefined') {
                filter = 'title';
                value = req.query.title;
            }

            farmerCollection.where(filter, '==', value)
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let { id } = doc;
                        let data = doc.data();
                        console.log(data);
                        //this line manually add the id to the result object since Firebase data doesnt not include id.
                        let farmer = { id, ...data };

                        farmerList.push(farmer)
                    })
                    res.send(farmerList);        
                })               
                .catch(err => {
                    console.log('Error getting farmer data', err);
                });
          
    //     } else {
    //       console.log("No user logged in");  
    //       res.send("Error getting user data");
    //     }
    //  });
};


exports.getFarmerById = function(req, res, next) {

    //TODO: Uncomment these lines to authenticate user first. Check with Zach or Andrew
    // firebase.auth().onAuthStateChanged((user) => {
    //     if (user) {
            let uid = req.params.id;
            farmerCollection.doc(uid)
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
                    console.log('Error getting farmer data', err);
                });
          
    //     } else {
    //       console.log("No user logged in");  
    //       res.send("Error getting user data");
    //     }
    //  });
};

exports.getFarmersList = function(req, res, next) {
    firebase.auth().onAuthStateChanged((user) => {
        if(user) {
            // farmerCollection.get().then((doc) => {
            //     const farmArray = [];
            //     data.forEach((doc) => {
            //         farmArray.push(doc.data().name)
            //     })
                
            //     res.send(farmArray);
            // })
            const farmArray = [];
            farmerCollection.get().then(function(query) {
                query.forEach(function(doc) {
                    farmArray.push(doc.data().name)
                })
                res.send(farmArray)
            })
            .catch(err => {
                console.log("Error retrieving farmer names", err)
            });
            
        } else {
            console.log("No user logged in");
            res.send("Error - No user signed in!");
        }
    });
}