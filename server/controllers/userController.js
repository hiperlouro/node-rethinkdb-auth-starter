var thinky    = require('thinky');
var r         = thinky.r;
var type      = thinky.type;
var User      = require('../models/user');
var tokenAuth = require('../services/tokenAuth');


exports.register = function(req , res){

	if(!req.body.username){return res.json({Error : "Username is Required"});}
  if(!req.body.encryptedPW){return res.json({Error : "Password is Required"});}

  User.filter({username:req.body.username}).run().then(function(userArray){
  	if(userArray[0]){return res.json({Error : "Username is in use"});}
  

		var user = new User(req.body);

		user.save().then(function(result) {
			console.log("User Created !!");
			res.json({
				user: user,
				token: tokenAuth.issue({id: user.id})
				});
		}).error(function(res){
			console.log("Error : " + res);
	 	});
	});
};


exports.users = function(req , res){

	var user = User.run().then(function(result){
		res.send(JSON.stringify(result));
	}).error(function(res){
		console.log("Error : " + res);
 	});
};


exports.user = function(req , res){

	var id = req.params.id;
	User.get(id).run().then(function(result){
		res.send(JSON.stringify(result));
	}).error(function(res){
		console.log("Error : " + res);
 	});
};


exports.editUser = function(req , res){

	var id = req.params.id;
	User.get(id).run().then(function(user){
		if (req.body.username) {user.username = req.body.username;}
		if (req.body.encyptedPW) {user.encryptedPW = req.body.encryptedPW;}
		user.save().then(function(result) {
			res.json({ message: 'User Updated !!'});
		}).error(function(res){
			console.log("Error : " + res);
 		});
	});
};


exports.deleteUser = function(req , res){

	var id = req.params.id;
	User.get(id).delete().run().then(function(error , result){
		res.json({
			error : error,
			result : result
		})
	});
};
