angular.module('userApp',['appRoutes', 'emailController', 'userControllers','userServices', 'ngAnimate', 'maincontroller', 'authServices','ngRoute'])

.config(function($httpProvider) {
	$httpProvider.interceptors.push('AuthInterceptors');
});