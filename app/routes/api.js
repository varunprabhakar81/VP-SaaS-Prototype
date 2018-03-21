var User = require('../models/user');
var Invoice = require('../models/invoice');
var InvoiceLines = require('../models/invoice-lines');
var jwt = require('jsonwebtoken');
var secret = 'harryporter';
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');


//Routes
module.exports = function(router) {

	var options = {
	  auth: {
	    api_user: 'varunprabh',
	    api_key: 'ah3VwCzMEYrTL4'
	  }
	}

	var client = nodemailer.createTransport(sgTransport(options));


	//http://localhost:port/api/users
	//USER REGISTRATION ROUTE
	router.post('/users',(req, res) => {
		var user = new User();
		user.username = req.body.username;
		user.password = req.body.password;
		user.email = req.body.email;
		user.name = req.body.name;
		user.temporarytoken = jwt.sign({username: user.username, email: user.email}, secret, {expiresIn: '24h'});;
		
		if(req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == '' || req.body.name == null || req.body.name == ''){
			res.json({success: false, message:'Ensure Username, Password and Email are provided'})
		}
		else { 
			user.save(function(err){
				if (err) {
					if (err.errors != null) {
						if (err.errors.name) {
						res.json({success: false, message: err.errors.name.message});
						} else if (err.errors.email) {
							res.json({success: false, message: err.errors.email.message});
						} else if (err.errors.username) {
							res.json({success: false, message: err.errors.username.message});
						} else if (err.errors.password) {
							res.json({success: false, message: err.errors.password.message});
						} else {
							res.json({success: false, message: err});
						}
					} else if(err) {
						if (err.code == 11000) {
							if (err.errmsg[60] == 'u') {
							 	res.json({success: false, message: 'That username is already taken'});
							} else if (err.errmsg[60] == 'e') {
								res.json({success: false, message: 'That email is already taken'});
							} 
							
						} else {
							res.json({success: false, message: err});
						}
					}

				} 
				else {


					var email = {
					  from: 'DigitalCloud ERP Support, support@digitalclouderp.com',
					  to: user.email,
					  subject: 'Welcome to DigitalCloud ERP! Confirm Your Email',
					  text: 'Hello' + user.name +'Thank you for registering at DigitalCloud ERP. Please click on the following link to complete your activation: http://localhost:8080/activate/' + user.temporarytoken,
					  html: 'Hello<strong> ' + user.name +'</strong>, <br><br> Thank you for registering at DigitalCloud ERP. Please click on the link below to complete your activation:<br><br> <a href="http://localhost:8080/activate/' + user.temporarytoken + '">http://localhost:8080/activate</a>'
					};

					client.sendMail(email, function(err, info){
					    if (err ){
					      console.log(error);
					    }
					    else {
					      console.log('Message sent: ' + info.response);
					    }
					});
					res.json({success: true, message: 'Account registered! Please check your e-mail for activation link.'});
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
			res.json({success: false, message:'Ensure all primary data is entered'})
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
	//INVOICE LINES CREATION ROUTE
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
		User.findOne({ username: req.body.username }).select('email username password active').exec(function(err,user) {
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
					} else if (!user.active) {
						res.json({ success: false, message: 'Account is not yet activated, please check your e-mail for activation link.', expired: true});
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


	//CHECK USERNAME
	//http://localhost:port/api/checkusername
	router.post('/checkusername', function(req, res) {
		User.findOne({ username: req.body.username }).select('username').exec(function(err,user) {
			if(err) throw err;

			if (user) {
				res.json( { success: false, message: 'That username is alreay taken' });

			} else {
				res.json( { success: true, message: 'Valid username' });
			}
		});
	});

	//CHECK E-MAIL
	//http://localhost:port/api/checkemail
	router.post('/checkemail', function(req, res) {
		User.findOne({ email: req.body.email }).select('email').exec(function(err,user) {
			if(err) throw err;

			if (user) {
				res.json( { success: false, message: 'That e-mail is alreay taken' });

			} else {
				res.json( { success: true, message: 'Valid e-mail' });
			}
		});
	});

	router.put('/activate/:token', function(req, res) {
		User.findOne({ temporarytoken: req.params.token }, function(err, user) {
			if(err) throw err;
			var token = req.params.token;

			//verify token
			jwt.verify(token, secret, function(err, decoded) {
  				if (err) {
  					res.json({ success: false, message: 'Activation link has expired.'});
  				} else if (!user){
  					res.json({ success: false, message: 'Activation link has expired.'});

  				} else {
					user.temporarytoken = false;
					user.active = true;
					user.save(function(err) {
						if(err) {
							console.log(err);
						} else {

							var email = {
								from: 'DigitalCloud ERP Support, support@digitalclouderp.com',
								to: user.email,
								subject: 'DigitalCloud ERP Account Activated',
								text: 'Hello' + user.name +'Your account has been successfully activated!',
								html: 'Hello<strong> ' + user.name +'</strong>, <br><br>Your account has been successfully activated!'
							};

							client.sendMail(email, function(err, info){
								if (err ){
									console.log(error);
								}
								else {
									console.log('Message sent: ' + info.response);
								}
							});
							res.json({ success: true, message: 'Account activated' });
						}
					});
  				}
			});

		});
	});


	//Resend activation link
	//http://localhost:port/api/resend
	router.post('/resend', function(req, res) {
		User.findOne({ username: req.body.username }).select('username password active').exec(function(err,user) {
		
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
					} else if (user.active) {
						res.json({ success: false, message: 'Account is already activated'});
					} else {
						res.json({ success: true, user: user});
					}
				}
			}
			else {
				res.json({ success : false, message:'Username not entered'});
			}
		});
	});

	router.put('/resend', function(req,res) {
		User.findOne( { username: req.body.username } ).select('username name email temporarytoken').exec(function(err,user) {
			if(err) throw err;
			user.temporarytoken = jwt.sign({username: user.username, email: user.email}, secret, {expiresIn: '24h'});;
			user.save(function(err) {
				if(err) { 
					console.log(err);
				} else {
					var email = {
					  from: 'DigitalCloud ERP Support, support@digitalclouderp.com',
					  to: user.email,
					  subject: 'DigitalCloud ERP Activation Link Request',
					  text: 'Hello' + user.name +'You recently requested new account activation link. Please click on the following link to complete your activation: http://localhost:8080/activate/' + user.temporarytoken,
					  html: 'Hello<strong> ' + user.name +'</strong>, <br><br> You recently requested new account activation link. Please click on the link below to complete your activation:<br><br> <a href="http://localhost:8080/activate/' + user.temporarytoken + '">http://localhost:8080/activate</a>'
					};

					client.sendMail(email, function(err, info){
					    if (err ){
					      console.log(error);
					    }
					    else {
					      console.log('Message sent: ' + info.response);
					    }
					});

					res.json({ success: true, message: 'Activation link has been sent to ' + user.email + '!'});

				}
			});
		});
	});

	// Route to send user's username to e-mail
	router.get('/resetusername/:email', function(req, res) {
		User.findOne({ email: req.params.email }).select('email name username').exec(function(err, user) {
			if (err) {
				res.json({ success: false, message: err }); // Error if cannot connect
			} else {
				if (!user) {
					res.json({ success: false, message: 'E-mail was not found' }); // Return error if e-mail cannot be found in database
				} else {
					// If e-mail found in database, create e-mail object
					var email = {
						from: 'DigitalCloud ERP Support, support@digitalclouderp.com',
						to: user.email,
						subject: 'DigitalCloud ERP Username Request',
						text: 'Hello ' + user.name + ', You recently requested your username. Please save it in your files: ' + user.username,
						html: 'Hello<strong> ' + user.name + '</strong>,<br><br>You recently requested your username. Please save it in your files: ' + user.username
					};

					// Function to send e-mail to user
					client.sendMail(email, function(err, info) {
						if (err) console.log(err); // If error in sending e-mail, log to console/terminal
					});
					res.json({ success: true, message: 'Username has been sent to e-mail! ' }); // Return success message once e-mail has been sent
				}
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