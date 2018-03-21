angular.module('maincontroller', ['authServices'])

.controller('mainCtrl', function(Auth, $timeout, $location, $rootScope, $window, $scope) {
	var app = this;
	app.loadme = false;

	//Need to figure out filling contacts dynamically
	$scope.member_list = {
    langs: [
      {value: 'ABC Construction', contact: 'John Someone', billing_email: 'john@gmail.com', ar_account_number: '1100', ar_account_name: 'Accounts Receivable'},
      {value: 'Big Roads Company', contact: 'Big Guy', billing_email: 'big@gmail.com', ar_account_number: '1200', ar_account_name: 'Other Accounts Receivable'},
      {value: 'Speciality Contractor', contact: 'Random Person', billing_email: 'rand@gmail.com', ar_account_number: '1200', ar_account_name: 'Other Accounts Receivable'},
      {value: 'Buildings Unlimited', contact: 'Billing Person', billing_email: 'bill@gmail.com', ar_account_number: '1100', ar_account_name: 'Accounts Receivable'},
      {value: 'Robby and Sons', contact: 'Son of Roby', billing_email: 'soroby@gmail.com', ar_account_number: '1100', ar_account_name: 'Accounts Receivable'}
    ]};

	$scope.contacts_list = {
    langs: [
      {value: 'John Someone'},
      {value: 'Big Guy'},
      {value: 'Random Person'},
      {value: 'Billing Person'},
      {value: 'Son of Roby'}
    ]};

    $scope.chapter_list = {
    langs: [
      {value: 'East Florida'},
      {value: 'South Dakota'},
      {value: 'Washington DC'},
      {value: 'Nevada'},
      {value: 'Houston'}
    ]};


    $scope.items_list = {
    langs: [
      {value: 'Membership Dues'},
      {value: 'PAC Contribution'},
      {value: 'Donation to Education Fund'},
      {value: 'Golf Event Ticket'},
      {value: 'T-Shirts'}
    ]};

    $scope.accounting_terms_list = {
    langs: [
      {value: 'Net 30', days: 30},
      {value: 'Net 60', days: 60},
      {value: 'Due on Receipt', days: 0}
    ]};

    $scope.coa_list = {
    langs: [
      {acct_number: '1100', acct_name:'Accounts Receivable'},
      {acct_number: '1200', acct_name:'Other Accounts Receivable'},
    ]};



	$rootScope.$on('$routeChangeStart', function() {
		if(Auth.isLoggedIn()) {
			app.isLoggedIn = true;
			Auth.getUser().then(function(data) {
				app.username = data.data.username;
				app.useremail = data.data.email;
				app.loadme = true;
			})
		} else {
			app.isLoggedIn = false;
			app.username = '';
			app.loadme = true;
		}
		if ($location.hash() == '_=_') $location.hash(null);
	});

	this.facebook = function() {
		app.disabled = true;
		$window.location = $window.location.protocol +'//' + $window.location.host + '/auth/facebook';
	};

	this.twitter = function() {
		app.disabled = true;
		$window.location = $window.location.protocol +'//' + $window.location.host + '/auth/twitter';
	};

	this.google = function() {
		app.disabled = true;
		$window.location = $window.location.protocol +'//' + $window.location.host + '/auth/google';
	};

	this.doLogin = function(loginData) {
		app.errorMsg = false;
		app.successMsg = false;
		app.loading = true;
		app.expired = false;
		app.disabled = true;

		Auth.login(app.loginData).then(function(data) {

			if(data.data.success){
				app.loading = false;
				//Create Success Message
				app.successMsg = data.data.message+'...Redirecting';
				//Redirect to Home Message
				$timeout(function(){
					$location.path('/about');
					app.loginData = '';
					app.successMsg = false;
					app.errorMsg = false;
				},1500);
				
			}else {
				if(data.data.expired) {				
					//Create Errpr Message
					app.loading = false;
					app.expired = true;
					app.errorMsg = data.data.message;

				} else {
					//Create Errpr Message
					app.disabled = false;
					app.loading = false;
					app.errorMsg = data.data.message;
				}
			}
		});
	};

	this.logout = function () {
		Auth.logout();
		$location.path('logout');
		$timeout(function() {
			$location.path('/');
		}, 1500);

	};
});
