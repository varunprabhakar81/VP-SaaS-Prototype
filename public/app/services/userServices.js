angular.module('userServices', [])

.factory('User', function($http) {
	userFactory = {};
	//User.create(regData)
	userFactory.create = function(regData) {
		return $http.post('/api/users', regData);
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