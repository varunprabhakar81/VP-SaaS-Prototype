var User = require('../models/user');
var Invoice = require('../models/invoice');
var InvoiceLines = require('../models/invoice-lines');
var jwt = require('jsonwebtoken');
var secret = 'harryporter';

//Routes
module.exports = function(router) {
	//http://localhost:port/api/users
	//USER REGISTRATION ROUTE
	router.post('/users',(req, res) => {
		var user = new User();
		user.username = req.body.username;
		user.password = req.body.password;
		user.email = req.body.email;
		user.name = req.body.name;
		
		if(req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == '' || req.body.name == null || req.body.name == ''){
			res.json({success: false, message:'Ensure Username, Password and Email are provided'})
		}
		else { 
			user.save(function(err){
				if(err) {
					res.json({success: false, message: 'Username or Email already exists!'});
				} else {
					res.json({success: true, message: 'User Created!'});
				}
			});
		}
	});


	//http://localhost:port/api/invoice
	//INVOICE CREATION ROUTE
	router.post('/invoice',(req, res) => {
		var invoice = new Invoice();
		invoice.member = req.body.member;
		invoice.invoicedate = req.body.invoicedate;
		invoice.invoiceduedate = req.body.invoiceduedate;
		invoice.chapter = req.body.chapter;
		invoice.totalamountdue = req.body.totalamountdue;


		if(req.body.member == null || req.body.member == ''
		   || req.body.invoicedate == null || req.body.invoicedate == ''
			|| req.body.invoiceduedate == null || req.body.invoiceduedate == ''
			|| req.body.chapter == null || req.body.chapter == ''
			|| req.body.totalamountdue == null || req.body.totalamountdue == ''
			 ){
			res.json({success: false, message:'Ensure Invoice primary data is provided'})
		}
		else { 
			invoice.save(function(err){
				if(err) {
					res.json({success: false, message: 'Failure occured!'+err});
				} else {
					res.json({success: true, message: 'Invoice Created!'});
				}
			});
		}
	});


	//http://localhost:port/api/invoice-lines
	//INVOICE CREATION ROUTE
	router.post('/invoice-lines',(req, res) => {
		var invoice_lines = new InvoiceLines();
		invoice_lines.item = req.body.item;
		invoice_lines.quantity = req.body.quantity;
		invoice_lines.rate = req.body.rate;
		invoice_lines.amount = req.body.amount;

		if(req.body.item == null || req.body.item == ''
		   || req.body.quantity == null || req.body.quantity == ''
			|| req.body.rate == null || req.body.rate == ''
			|| req.body.amount == null || req.body.amount == ''
			 ){
			res.json({success: false, message:'Ensure all mandatory invoice line items are provided!'})
		}
		else { 
			invoice_lines.save(function(err){
				if(err) {
					res.json({success: false, message: 'Failure occured!'+err});
				} else {
					res.json({success: true, message: 'Invoice Lines Created!'});
				}
			});
		}
	});

	//USER LOGIN ROUTE
	//http://localhost:port/api/authenticate
	router.post('/authenticate', function(req, res) {
		User.findOne({ username: req.body.username }).select('email username password').exec(function(err,user) {
			if(err) throw err;

			if(req.body.username) {
				if(!user) {
					res.json({ success : false, message:'Could not authenticate user'});
				} else if (user) {				
					if(req.body.password) {
					 	var validPassword = user.comparePassword(req.body.password);
					}
					else {
						res.json({ success: false, message: 'No password provided'});
					}

					if(!validPassword) {
						res.json({ success: false, message: 'Could not authenticate password'});
					} else {
						var token = jwt.sign({username: user.username, email: user.email}, secret, {expiresIn: '24h'});
						res.json({success: true, message: 'User authenticated!', token: token});
					}
				}
			}
			else {
				res.json({ success : false, message:'Username not entered'});
			}
		});
	});

	router.use(function(req, res, next) {
		var token = req.body.token || req.body.query || req.headers['x-access-token'];

		if (token) {
			//verify token
			jwt.verify(token, secret, function(err, decoded) {
  				if (err) {
  					res.json({ success: false, message: 'Token invalid'});
  				} else{
  					req.decoded = decoded;
  					next();
  				}
			});
		} else {
			res.json({ success: false, message: 'No token provided'});
		}

	});

	router.post('/me', function(req, res) {
		res.send(req.decoded);
	});

	return router;
}