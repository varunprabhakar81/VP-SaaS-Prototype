angular.module('userServices', [])

.factory('User', function($http) {
	userFactory = {};
	//User.create(regData)
	userFactory.create = function(regData) {
		return $http.post('/api/users', regData);
	}

	//User.checkUsername(regData)	
	userFactory.checkUsername = function(regData) {
		return $http.post('/api/checkusername', regData);
	}

	//User.checkEmail(regData)
	userFactory.checkEmail = function(regData) {
		return $http.post('/api/checkemail', regData);
	}

	//User.activateAccount(token);
	userFactory.activateAccount = function(token) {
		return $http.put('/api/activate/' + token);
	}

	//User.checkCredentials(loginData);
	userFactory.checkCredentials = function(loginData) {
		return $http.post('/api/resend', loginData);
	}

	//User.resendLink(userData);
	userFactory.resendLink = function(username) {
		return $http.put('/api/resend', username);
	}

	// Send user's username to e-mail
	//User.sendUsername(userData);
	userFactory.sendUsername = function(userData) {
		return $http.get('/resetusername/'+userData);
	}

	return userFactory;
})

.factory('Invoice', function($http) {
	invoiceFactory = {};

	//invoice.createInvoice(invoiceData)
	invoiceFactory.create = function(invoiceData) {
	return $http.post('/api/invoice', invoiceData);
	}

	return invoiceFactory;
});