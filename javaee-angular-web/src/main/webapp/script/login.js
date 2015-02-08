//refer to http://stackoverflow.com/questions/18935476/angularjs-ui-modal-forms
var loginApp = angular.module('loginmodal', ['ui.bootstrap', 'ngStorage', 'ngResource']);
loginApp.controller('loginCtrl', function ($scope, $modal, $log, $sessionStorage, $http, userService) {
    $scope.user = {
        userId: null,
        password: null
    };
    //alert($sessionStorage)
    $scope.login = function () {
    	//alert('xxx')
        $modal.open({
            templateUrl: 'loginmodal',
            backdrop: true,
            windowClass: 'modal',
            controller: function ($scope, $modalInstance, $log, user) {
                $scope.user = user;
                $scope.submit = function () {
                	//alert(user.userId)
                	//alert(user.password)
                    var listUsersArgs = {
                    		password: user.password,
                    		userId: user.userId
                    };
                    userService.get(listUsersArgs, function (data) {
                    	//alert(data.userId)
                    	if (typeof data.userId == 'undefined') {
                    		alert('login failed');
                    	}
                    	else {
                    		alert('successfully login');
                    		$sessionStorage.isLogged = true;
                    		$sessionStorage.userId = data.userId;
                    	}
                	});
                    $log.log('Submiting user info.');
                    $log.log(user);
                    $modalInstance.dismiss('cancel');
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
                $scope.signup = function () {
                	//alert('xxx')
                	//close login dodal
                	$modalInstance.dismiss('cancel');
                    $modal.open({
                        templateUrl: 'signupmodal',
                        backdrop: true,
                        windowClass: 'modal',
                        controller: function ($scope, $modalInstance, $log, user) {
                            $scope.user = user;
                            $scope.submit = function () {
                            	$http({
                          	      method: 'POST',
                          	      url: "https://localhost:8443/javaee-angular/resources/users",           
                          	      data: $scope.user,
                          	      headers: {'Content-Type': 'application/json'}
                          	            }).success(
                          	            		alert('signup success')
                          	            );                                

                                $log.log('Submiting user info.');
                                $log.log(user);
                                $modalInstance.dismiss('cancel');
                            };
                            $scope.cancel = function () {
                                $modalInstance.dismiss('cancel');
                            };
                        },
                        resolve: {
                            user: function () {
                                return $scope.user;
                            }
                        }
                    });
                };   
 
                
                
                
            },
            resolve: {
                user: function () {
                    return $scope.user;
                }
            }
        });
    };

    $scope.signup = function () {
    	//alert('xxx')
    	//close login dodal
        $modal.open({
            templateUrl: 'signupmodal',
            backdrop: true,
            windowClass: 'modal',
            controller: function ($scope, $modalInstance, $log, user) {
                $scope.user = user;
                $scope.submit = function () {
                	$http({
              	      method: 'POST',
              	      url: "https://localhost:8443/javaee-angular/resources/users",           
              	      data: $scope.user,
              	      headers: {'Content-Type': 'application/json'}
              	            }).success(
              	            		alert('signup success')
              	            );                                

                    $log.log('Submiting user info.');
                    $log.log(user);
                    $modalInstance.dismiss('cancel');
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            },
            resolve: {
                user: function () {
                    return $scope.user;
                }
            }
        });
    };    
    
    $scope.logout = function () {
		$sessionStorage.isLogged = false;
		$sessionStorage.userId = '';    	
    };

    $scope.$on('openLoginForm', function (event) {
    	$scope.login();
    }); 
    
  
});

loginApp.controller('categoryCtrl', function ($scope, $modal, $log, $sessionStorage, $http, categoryService) {
	$scope.flag = '';
	$scope.categories;
    $scope.retriveCategory = function () {      
    	categoryService.get(function (data) {
            $scope.categories = data;
            alert('xxx')
            alert(JSON.stringify($scope.categories));
        });      
    };
    $scope.$watch('flag', function () {
    	alert('categories changed');
        $scope.retriveCategory();
    }, true);   
  
});

loginApp.factory('categoryService', function ($resource) {
    return $resource('resources/categories/:id');
});

loginApp.factory('userService', function ($resource) {
    return $resource('resources/users/:id');
});