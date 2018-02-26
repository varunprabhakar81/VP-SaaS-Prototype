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

})

.controller('invoiceCtrl', function($http, $location, $timeout, Invoice) {

	var app = this;

	this.createInvoice = function(invoiceData) {
		app.errorMsg = false;
		app.successMsg = false;
		app.loading = true;

		Invoice.create(app.invoiceData).then(function(data) {
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

.controller('ListController', function($scope, Invoice, $timeout, $location) {

	var app = this;
	var total = 0;

    $scope.personalDetails = [
        {
            'item':'',
            'quantity':'',
            'rate':'',
            'amount':'', 
        }];
    
        $scope.addNew = function(personalDetail){
        	var app = this;
        	app.errorMsg = false;
        	app.successMsg = false;
        	app.loading = true;

        	if($scope.personalDetails[$scope.personalDetails.length-1].item &&
        		$scope.personalDetails[$scope.personalDetails.length-1].quantity &&
        		$scope.personalDetails[$scope.personalDetails.length-1].rate)
        	{
        		app.loading = false;
        		//Create Success Message
				//app.successMsg = data.data.message+'...Redirecting';

	        	$scope.personalDetails.push({ 
	                'item': "", 
	                'quantity': "",
	                'rate': "",
	                'amount': ""
	            });	
        	} else {
        		app.loading = false;
        		//Create Errpr Message
				app.errorMsg = 'Enter all line item fields mandatory!';
        	}
        	//console.log($scope.personalDetails);
            
        };

        $scope.createinvalert = function(invoiceData){

        	var app = this;
			
			app.errorMsg = false;
        	app.successMsg = false;
        	app.loading = true;

        	//var invAmount = $scope.total();

        	Invoice.create(invoiceData).then(function(data) {
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
        
        $scope.total = function(){
        	var total = 0;
        	// console.log($scope.personalDetails);
            angular.forEach($scope.personalDetails, function(item){
				total += item.amount;
            });
            // console.log(total);
            return total;
        };

        $scope.remove = function(){
            var newDataList=[];
            $scope.selectedAll = false;
            angular.forEach($scope.personalDetails, function(selected){
                if(!selected.selected){
                    newDataList.push(selected);
                }
            }); 
            $scope.personalDetails = newDataList;
        };
    
    	$scope.checkAll = function () {
        if (!$scope.selectedAll) {
            $scope.selectedAll = true;
        } else {
            $scope.selectedAll = false;
        }
        angular.forEach($scope.personalDetails, function(personalDetail) {
            personalDetail.selected = $scope.selectedAll;
        });
    };    
 });