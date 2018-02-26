angular.module('userApp',['appRoutes','userControllers','userServices', 'ngAnimate', 'maincontroller', 'authServices','ngRoute'])

.config(function($httpProvider) {
	$httpProvider.interceptors.push('AuthInterceptors');
});