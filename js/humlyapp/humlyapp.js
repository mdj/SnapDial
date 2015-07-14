'use strict';


(function() {
	// Declare app level module which depends on views, and components
	var app = angular.module('humly', [
		"firebase",
		"ngRoute", 
		"profileControllers",
		'naif.base64'
		]);



	app.config(['$routeProvider', '$locationProvider',
	  function($routeProvider, $locationProvider) {
	    $routeProvider.
	      when('/new', {
	        templateUrl: 'partials/new.html',
	        controller: 'NewProfileCtrl'
	      }).
	      when('/profiles/:profileId', {
	        templateUrl: 'partials/profile.html',
	        controller: 'ProfileDetailCtrl'
	      }).
	      otherwise({
	        redirectTo: '/new'
	      });
	      $locationProvider.html5Mode( true );
	  }]);


	app.config( [
	    '$compileProvider',
	    function( $compileProvider )
	    {   
	        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|sms|tel|data):/);
	        // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
	    }
	]);

	// input change detector
	app.directive('customOnChange', function() {
	  return {
	    restrict: 'A',
	    link: function (scope, element, attrs) {
	      var onChangeHandler = scope.$eval(attrs.customOnChange);
	      element.bind('change', onChangeHandler);
	    }
	  };
	});


	app.factory('Page', function(){
	  var title = 'Snapdial.co – Retake your home screen';
	  return {
	    title: function() { return title; },
	    setTitle: function(newTitle) { title = newTitle; }
	  };
	});

	app.controller('MainCtrl', ["$scope", "Page", function($scope, Page) {
	  $scope.Page = Page;
	}]);


	app.factory("profileObj", ["$firebaseObject", "$location",
	  function($firebaseObject, $location) {
	    // create a reference to the database location where we will store our data
	    // var randomRoomId = Math.round(Math.random() * 100000000);
	    // var uuid = "-fsdfkbemdj";
	    var uuid = $location.path();

	    var ref = new Firebase("https://humly.firebaseio.com/profiles" + uuid);

	    console.log("ref", ref);


	    // this uses AngularFire to create the synchronized array
	    return [$firebaseObject(ref), ref];
	  }
	]);


	app.controller('ProfileCtrl',  ["$scope", "profileObj", function($scope, profileObj)  {
	  // profileRef.set(profile);

	 $scope.info = profileObj[0];
	 $scope.fref = profileObj[1];

	 var syncObject = profileObj[0];

	 syncObject.$bindTo($scope, "info");


	 $scope.addSocial = function() {
      // calling $add on a synchronized array is like Array.push(),
      // except that it saves the changes to our database!
      $scope.info.$add({
        from: $scope.user,
        content: $scope.message
      });

      // reset the message input
      $scope.message = "";
    };

    // if the messages are empty, add something for fun!
    $scope.info.$loaded(function() {
    	console.log($scope.info);
      if ($scope.info.$value === null) {
      	console.log("empty");
      	// $scope.info.name = "John Doe";
        $scope.fref.$add( {
			name : "John Doe",
			position : "Agent",
			company : "Coorporate",
			phone : "+01 999 555 20",
			isMobile : true,
			canEdit : true,
			social : []
        });
      }
    });


	}]);



	// app.controller('ProfileCtrl', function($scope, $firebaseObject)  {

	//   var ref = new Firebase("https://humly.firebaseio.com");
	//   var profilesRef = ref.child("profiles");
	//   var profileRef = profilesRef.child("-fsdfkbemdj");


	//   // profileRef.set(profile);




	//  var syncObject = $firebaseObject(profileRef);

	//   syncObject.$bindTo($scope, "info");


	//  $scope.info = {};
 //    // if the messages are empty, add something for fun!
 //    $scope.info.$loaded(function() {
 //    	console.log("didn't find that person");
 //      // if ($scope.info.length === 0) {
 //      //   $scope.messages.$add({
 //      //     from: "Firebase Docs",
 //      //     content: "Hello world!"
 //      //   });
 //      // }
 //    });

	// });



	app.directive("clickToEdit", function() {
	    var editorTemplate = '<div class="click-to-edit" >' +
	    '<a ng-click="enableEditor()">' +
	        '<div ng-hide="view.editorEnabled">' +
	            '{{value}} ' +
	            '</a>' +
	        '</div>' +
	        '<div ng-show="view.editorEnabled">' +
	            '<input ng-model="view.editableValue">' +
	            '<a href="#" ng-click="save()">Save</a>' +
	            ' or ' +
	            '<a ng-click="disableEditor()">cancel</a>.' +
	        '</div>' +
	    '</div>';

	    return {
	        restrict: "A",
	        replace: true,
	        template: editorTemplate,
	        scope: {
	            value: "=clickToEdit",
	        },
	        controller: function($scope) {
	            $scope.view = {
	                editableValue: $scope.value,
	                editorEnabled: false
	            };

	            $scope.enableEditor = function() {
	                $scope.view.editorEnabled = true;
	                $scope.view.editableValue = $scope.value;
	            };

	            $scope.disableEditor = function() {
	                $scope.view.editorEnabled = false;
	            };

	            $scope.save = function() {
	                $scope.value = $scope.view.editableValue;
	                $scope.disableEditor();
	            };
	        }
	    };
	});
	var profile = {
			name : "Morten Dam",
			position : "CEO Bitch",
			company : "Gluino",
			canEdit : true
		};


	var profiles = [{
			name : "Morten Dam",
			position : "CEO Bitch",
			company : "Gluino",
			canEdit : true
		},
		{
			name : "Michael Hansen",
			position : "CEO Bitch",
			company : "Issuu",
			canEdit : true
		}
		];


})();
