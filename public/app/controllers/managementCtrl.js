angular.module('managementController', [])

.controller('managementCtrl', function(User, $scope) {
	var app = this;
	app.loading = true;
	app.accessDenied = true;
	app.errorMsg = false;

	app.editAccess = false;
	app.deleteAccess = false;
	app.limit = 5;

	User.getUsers().then(function(data) {
		if(data.data.success) {
			if(data.data.permission === 'admin' || data.data.permission === 'moderator') {
				app.users = data.data.users;
				app.loading = false;
				app.accessDenied = false;
				
				if(data.data.permission === 'admin') {
					app.deleteAccess = true;
				}

				app.editAccess = true;

			} else {
				app.errorMsg = 'Insufficient Permissions';
				app.loading = false;
			}

		} else {
			app.errorMsg = data.data.message;
			app.loading = false;
		}
	});
	
	app.showMore = function(number) {
		app.showMoreError = false;
		if(number > 0) {
			app.limit = number;
		} else {
			app.showMoreError = 'Please enter a valid number';
		}
	};

	app.showAll= function(number) {
		app.limit = undefined;
		app.showMoreError = false;
		$scope.number = undefined;
	};

});