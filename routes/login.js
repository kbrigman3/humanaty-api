var firebase = require('firebase');
require('firebase/auth');
require('firebase/firestore');
var db = require('./firebase'); //get reference to firebase config file

var express = require('express');
var router = express.Router();

var database = firebase.firestore(db.app); //declare database using app initialization in firebase.js

var success;

function loginUser(email, password) {
    success = true;
    return firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        success = false;
        console.log(errorMessage);
    });   
}

router.post('/', function(req, res, next) {
    /*Here, we're making sure to send the response after the firebase function has executed. Because of the error 
    catch, it will always execute last in the stack, even after sending a response, so something like 
    
    loginUser(req.body.email, req.body.password)
    res.send(success)
    
    would not work, as the response would be sent before an error would be caught, if there was one*/
    console.log("1")
    function sendResponse() {
        console.log("2")
        res.send(success);
    }
    loginUser(req.body.email, req.body.password).then(sendResponse);
});


module.exports = router;