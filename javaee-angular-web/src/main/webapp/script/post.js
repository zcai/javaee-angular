var app = angular.module('posts', ['ngResource', 'ngGrid', 'ui.bootstrap']);

// Create a controller with name postsListController to bind to the grid section.
app.controller('postsListController', function ($scope, $rootScope, postService) {
    // Initialize required information: sorting, the first page to show and the grid options.
    $scope.sortInfo = {fields: ['id'], directions: ['asc']};
    $scope.posts = {currentPage: 1};

    // Refresh the grid, calling the appropriate rest method.

    $scope.refreshGrid = function () {
        var listPostsArgs = {
            page: $scope.posts.currentPage,
            sortFields: $scope.sortInfo.fields[0],
            sortDirections: $scope.sortInfo.directions[0]
        };
        //alert('xxx');
        
        postService.get(listPostsArgs, function (data) {
            $scope.posts = data;
        	//alert(JSON.stringify($scope.posts));
        });      
    };


    // Broadcast an event when an element in the grid is deleted. No real deletion is perfomed at this point.
    $scope.deleteRow = function (row) {
        $rootScope.$broadcast('deletePost', row.entity.id);
    };

    // Watch the sortInfo variable. If changes are detected than we need to refresh the grid.
    // This also works for the first page access, since we assign the initial sorting in the initialize section.
    // pay attention: when the page is loaded the first time, this method is called because sortInfo is initialized
    $scope.$watch('sortInfo.fields[0]', function () {
    	//alert('setinfo changed');
        $scope.refreshGrid();
    }, true);


    // Do something when the grid is sorted.
    // The grid throws the ngGridEventSorted that gets picked up here and assigns the sortInfo to the scope.
    // This will allow to watch the sortInfo in the scope for changed and refresh the grid.
    $scope.$on('ngGridEventSorted', function (event, sortInfo) {
        $scope.sortInfo = sortInfo;
    });

    // Picks the event broadcasted when a post is saved or deleted to refresh the grid elements with the most
    // updated information.
    $scope.$on('refreshGrid', function () {
        $scope.refreshGrid();
    });

    // Picks the event broadcasted when the form is cleared to also clear the grid selection.
    $scope.$on('clear', function () {
        $scope.gridOptions.selectAll(false);
    });
});

// Create a controller with name postsFormController to bind to the form section.
app.controller('postsFormController', function ($scope, $rootScope, postService, categoryService) {
	$scope.flag = '';
    $scope.retriveCategory = function () {      
    	categoryService.get(function (data) {
            $scope.options = data.list;
        	alert(JSON.stringify($scope.options));
        });      
    };
    $scope.$watch('flag', function () {
    	//alert('categories changed');
        $scope.retriveCategory();
    }, true);
    
    // Clears the form. Either by clicking the 'Clear' button in the form, or when a successfull save is performed.
    $scope.clearForm = function () {
        $scope.post = null;
        // Resets the form validation state.
        $scope.postForm.$setPristine();
        // Broadcast the event to also clear the grid selection.
        $rootScope.$broadcast('clear');
    };

    // Calls the rest method to save a post.
    $scope.updatePost = function () {
    	alert($scope.post.content)
    	alert(JSON.stringify($scope.selectedCategory))
    	$scope.post.categoryId = $scope.selectedCategory.id;
        postService.save($scope.post).$promise.then(
            function () {
                // Broadcast the event to refresh the grid.
                $rootScope.$broadcast('refreshGrid');
                // Broadcast the event to display a save message.
                $rootScope.$broadcast('postSaved');
                $scope.clearForm();
            },
            function () {
                // Broadcast the event for a server error.
                $rootScope.$broadcast('error');
            });
    };

    // Picks up the event broadcasted when the post is selected from the grid and perform the post load by calling
    // the appropiate rest service.
    $scope.$on('postSelected', function (event, id) {
        $scope.post = postService.get({id: id});
    });

    // Picks us the event broadcasted when the post is deleted from the grid and perform the actual post delete by
    // calling the appropiate rest service.
    $scope.$on('deletePost', function (event, id) {
        postService.delete({id: id}).$promise.then(
            function () {
                // Broadcast the event to refresh the grid.
                $rootScope.$broadcast('refreshGrid');
                // Broadcast the event to display a delete message.
                $rootScope.$broadcast('postDeleted');
                $scope.clearForm();
            },
            function () {
                // Broadcast the event for a server error.
                $rootScope.$broadcast('error');
            });
    });
});

// Create a controller with name alertMessagesController to bind to the feedback messages section.
app.controller('alertMessagesController', function ($scope) {
    // Picks up the event to display a saved message.
    $scope.$on('postSaved', function () {
        $scope.alerts = [
            { type: 'success', msg: 'Record saved successfully!' }
        ];
    });

    // Picks up the event to display a deleted message.
    $scope.$on('postDeleted', function () {
        $scope.alerts = [
            { type: 'success', msg: 'Record deleted successfully!' }
        ];
    });

    // Picks up the event to display a server error message.
    $scope.$on('error', function () {
        $scope.alerts = [
            { type: 'danger', msg: 'There was a problem in the server!' }
        ];
    });

    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };
});

// Service that provides posts operations
// AngularJS can consume the web service using $resource. This module is injected via 'ngResource'.
// refer to http://draptik.github.io/blog/2013/07/28/restful-crud-with-angularjs/
// https://docs.angularjs.org/api/ngResource/service/$resource
app.factory('postService', function ($resource) {
    return $resource('resources/posts/:id');
});

app.factory('categoryService', function ($resource) {
    return $resource('resources/categories/:id');
});
