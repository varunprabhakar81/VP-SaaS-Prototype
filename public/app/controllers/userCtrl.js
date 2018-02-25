angular.module('userControllers', ['userServices'])

.controller('regCtrl', function($http, $location, $timeout, User) {

	var app = this;

	this.regUser = function(regData) {
		app.errorMsg = false;
		app.successMsg = false;
		app.loading = true;

		User.create(app.regData).then(function(data) {

			if(data.data.success){
				app.loading = false;
				//Create Success Message
				app.successMsg = data.data.message+'...Redirecting';
				//Redirect to Home Message
				$timeout(function(){
					$location.path('/');
				},1500);
				
			}else {
				app.loading = false;
				//Create Errpr Message
				app.errorMsg = data.data.message;
			}
		});
	};
})

.controller('facebookCtrl', function($routeParams, Auth, $location, $window) {
	var app = this;
	if($window.location.pathname == '/facebookerror') {
		app.errorMsg = 'Facebook e-mail not found in database'
	} else {
		Auth.facebook($routeParams.token);
		$location.path('/');		
	}

})

.controller('twitterCtrl', function($routeParams, Auth, $location, $window) {
	var app = this;
	if($window.location.pathname == '/twittererror') {
		app.errorMsg = 'Twitter e-mail not found in database'
	} else {
		Auth.facebook($routeParams.token);
		$location.path('/');		
	}

})

.controller('googleCtrl', function($routeParams, Auth, $location, $window) {
	var app = this;
	if($window.location.pathname == '/googleerror') {
		app.errorMsg = 'Google e-mail not found in database'
	} else {
		Auth.facebook($routeParams.token);
		$location.path('/');		
	}

});


