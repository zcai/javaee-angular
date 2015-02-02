var app = angular.module('posts', ['ngResource', 'ngGrid', 'ui.bootstrap', 'textAngular']);
// Create a controller with name postsListController to bind to the grid section.
/*
app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.crossDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.common["Accept"] = "application/json";
    $httpProvider.defaults.headers.common["Content-Type"] = "application/json";
 }]);
 */
app.controller('postsViewController', function ($scope, $rootScope, $sessionStorage, $anchorScroll, $location, $http, postService, commentService) {
	//alert(loginService.userId)
	// Initialize required information: sorting, the first page to show and the grid options.
    $scope.sortInfo = {fields: ['id'], directions: ['asc']};
    $scope.posts = {currentPage: 1};
    $scope.postId2CommentCount = {};
    $scope.commentFormVisibility = {};

    // Refresh the grid, calling the appropriate rest method.
    $scope.refreshGrid = function () {
        var listPostsArgs = {
            page: $scope.posts.currentPage,
            sortFields: $scope.sortInfo.fields[0],
            sortDirections: $scope.sortInfo.directions[0]
        };
        
        postService.get(listPostsArgs, function (data) {
            $scope.posts = data;
        	//alert(JSON.stringify($scope.posts));
            
            //count comments for each post and store results in $scope.postId2CommentCount
            for (var i = 0; i < $scope.posts.list.length; i++) {
            	//alert($scope.posts.list[i].id)
            	$rootScope.$broadcast('countComments', $scope.posts.list[i].id);
            	/*
            	 *must use the above broadcast because commentService.get will be running async
                var listCommentsArgs = {
                		postId: $scope.posts.list[i].id
                };
                commentService.get(listCommentsArgs, function (dataComments) {
                	$scope.postId2CommentCount[listCommentsArgs.postId] = dataComments.list.length;
                	alert(listCommentsArgs.postId)
                	alert(dataComments.list.length)
            	});
            	*/
            }
        }); 
    };
    
    $scope.$on('countComments', function (event, id) {
    	$scope.comment.postId = id;
        var listCommentsArgs = {
        	postId: id
        };
        commentService.get(listCommentsArgs, function (dataComments) {
        	$scope.postId2CommentCount[listCommentsArgs.postId] = dataComments.list.length;
    	});
    });  
    
    
    // Watch the sortInfo variable. If changes are detected than we need to refresh the grid.
    // This also works for the first page access, since we assign the initial sorting in the initialize section.
    // pay attention: when the page is loaded the first time, this method is called because sortInfo is initialized
    $scope.$watch('sortInfo.fields[0]', function () {
    	//alert('setinfo changed');
        $scope.refreshGrid();
    }, true);
    // Broadcast an event when an element in the grid is deleted. No real deletion is perfomed at this point.
    $scope.selectRow = function (row) {
        $rootScope.$broadcast('postSelected', row.entity.id);
    };
    // Picks up the event broadcasted when the post is selected from the grid and perform the post load by calling
    // the appropiate rest service.
    $scope.$on('postSelected', function (event, id) {
        $scope.post = postService.get({id: id});
    });    

    $scope.selectedPost = function (postId) {
    	if (! $sessionStorage.isLogged) {
    		//alert("userId is empty")
    		$rootScope.$broadcast('openLoginForm');
    	}
    	else {
    		//only allow one comment form open
    		for (var index in $scope.commentFormVisibility) {
    			//close all opened comment forms
    			$scope.commentFormVisibility[index] = false;
    		}
    		//open the selected comment form
    		$scope.commentFormVisibility[postId] = ! $scope.commentFormVisibility[postId];
    	}
    	$rootScope.$broadcast('selectedPost', postId);
    };

    $scope.viewComments = function (postId) {
	    $rootScope.$broadcast('viewComments', postId);
    };
    
    $scope.hideComments = function (postId) {
    	$rootScope.$broadcast('hideComments', postId);
    };
    
	$scope.comment = {};
	$scope.comments = {};
    // Calls the rest method to save a comment.
    $scope.addComment = function () {
    	$scope.comment.userId = $sessionStorage.userId;
    	//post, put, delete not work, so use $http instead of commentService.save
    	
    	$http({
    	      method: 'POST',
    	      url: "https://localhost:8443/javaee-angular/resources/comments",           
    	      data: $scope.comment,
    	      headers: {'Content-Type': 'application/json'}
    	            }).success(
    	            		function () {
    	                        // Broadcast the event to refresh the grid.
    	                        $rootScope.$broadcast('refreshGrid');
    	                        // Broadcast the event to display a save message.
    	                        $rootScope.$broadcast('commentSaved');
    	                        //$scope.clearForm();
    	                    },
    	                    function () {
    	                        // Broadcast the event for a server error.
    	                        $rootScope.$broadcast('error');
    	                    }	
    	            );
    	/*
    	commentService.save($scope.comment).$promise.then(
            function () {
                // Broadcast the event to refresh the grid.
                $rootScope.$broadcast('refreshGrid');
                // Broadcast the event to display a save message.
                $rootScope.$broadcast('commentSaved');
                //$scope.clearForm();
            },
            function () {
                // Broadcast the event for a server error.
                $rootScope.$broadcast('error');
            });
            */
            
    };
    
    
    $scope.$on('commentSaved', function (event) {
    	$scope.postId2CommentCount[$scope.comment.postId]++;
    	$scope.comment = {};
    });
    
    $scope.$on('selectedPost', function (event, id) {
    	$scope.comment.postId = id;
    });  

    $scope.$on('viewComments', function (event, postId) {
        var listCommentsArgs = {
        		postId: postId
        };
    	commentService.get(listCommentsArgs, function (data) {
            $scope.comments = data;
            var commentHTML = '<table style="width:100%;">';
            for (var i = 0; i < $scope.comments.list.length; i++) {
            	//alert($scope.comments.list[i].content);
            	var datetimedetail = new Date($scope.comments.list[i].commentTime);
            	var date = datetimedetail.getFullYear() + "-" + datetimedetail.getMonth() + "-" + datetimedetail.getDay();
            	commentHTML = commentHTML + '<tr><td style="vertical-align: top;width:35px;"><img src="images/person.png" style="width:32px;"/></td><td>' + $scope.comments.list[i].userId + '@' + date + '</td></tr><tr><td></td><td>'+ $scope.comments.list[i].content + '</td></tr><tr><td><br/></td><td></td></tr>';
            }
            commentHTML += "</table>";
            var el = document.getElementById(postId);
            el.innerHTML = commentHTML;
            el.style.display = "block";
        	//alert(JSON.stringify($scope.comments));
/*
        	var el = document.getElementById(id);
        	//alert(el.style.width);
        	//alert(el.getBoundingClientRect().top)
        	var commentSectionEl = document.getElementById('commentSection');
        	el.innerHTML = commentSectionEl.innerHTML;
        	
        	//commentSectionEl.style.position = "absolute";
        	//commentSectionEl.style.left = 200 + 'px';
        	//commentSectionEl.style.top = el.style.top; 
*/        	
    	});      
    	//alert(id)
   	
    });
    $scope.$on('hideComments', function (event, postId) {
    	document.getElementById(postId).style.display = "none";
    });
    
    $scope.scrollTo = function(elementid) {
    	//yOffset does not work for the angularjs version 1.2.28 used for this project.
    	//some code not work in version 1.4, so I use 1.2.28, need to make it work for version 1.4 later
    	//it works for version 1.4
        $anchorScroll.yOffset = 400;
        var newHash = elementid;
        if ($location.hash() !== newHash) {
          // set the $location.hash to `newHash` and
          // $anchorScroll will automatically scroll to it
          $location.hash(elementid);
        } else {
          // call $anchorScroll() explicitly,
          // since $location.hash hasn't changed
          $anchorScroll();
        }        
	};
    
});

// Service that provides posts operations
// AngularJS can consume the web service using $resource. This module is injected via 'ngResource'.
// refer to http://draptik.github.io/blog/2013/07/28/restful-crud-with-angularjs/
// https://docs.angularjs.org/api/ngResource/service/$resource
app.factory('postService', function ($resource) {
    return $resource('resources/posts/:id');
});

app.factory('commentService', function ($resource) {
    return $resource('resources/comments/:id');
});
var rootApp = angular.module('rootApp', ['posts', 'loginmodal']);
