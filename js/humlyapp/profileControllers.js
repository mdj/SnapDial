(function() {

var profileControllers = angular.module('profileControllers', ['firebase']);

profileControllers.controller('NewProfileCtrl', ['$scope', '$location',
  function ($scope, $location) {
    var ref = new Firebase("https://humly.firebaseio.com/profiles");

    $scope.name = "";
    $scope.phone = "";
    $scope.position = "";
    $scope.company = "";
    $scope.isMobile = true;
    $scope.imageData = "";
    $scope.status = "All fields are optional";
    $scope.ip="";
    $scope.country = "";
    $scope.city = "";

	$.getJSON( "http://api.hostip.info/get_json.php",
    function(data){

    	$scope.ip =data.ip;
    	$scope.city = data.city;
    	$scope.country = data.country_code;
    });



	$scope.fileSelected = function(event){

	    var files = event.target.files;
	    // console.log(files);

		loadImage.parseMetaData(files[0], function (data) {
			options = 	        {
	        	maxWidth: 600,
	        	canvas: true,

	        }; // Options

            if (data.exif) {
                options.orientation = data.exif.get('Orientation');
                // displayExifData(data.exif);
            }

    	    loadImage(
	        files[0],
	        function (img) {
	            // document.body.appendChild(img);
	            var imgData = img.toDataURL("image/jpeg",0.7);
    	        $(".profile_picture").css('background-image', 'url(' + imgData + ')');
		        $(".background-image").css('background-image', 'url(' + imgData + ')');
		        $(".upload_img").css("background", "none");
    	        $scope.imageData = imgData; // save data for uploading
	        }, options
	    );

        });

    };

    $scope.create = function(){
	    // this new, empty ref only exists locally
		var newChildRef = ref.push();
		// we can get its id using key()

		// now it is appended at the end of data at the server
		$scope.status = "id: " +  newChildRef.key();

		var profileData = {name: $scope.name,
						phone : $scope.phone,
						position: $scope.position,
						company : $scope.company,
						isMobile : $scope.isMobile,
						image : $scope.imageData,
						social : [
							// {type : "fb",
							//  text : "Facebook Profile",
							//  url : "https://www.facebook.com/mortendamj"
							// },
							// {type : "ln",
							//  text : "LinkedIn",
							//  url : "https://dk.linkedin.com/in/mortendam"
							// }

						],
						createdAt: Firebase.ServerValue.TIMESTAMP,
						createdBy: $scope.ip,
						createdCity: $scope.city,
						createdCnty: $scope.country
					};

		// console.log(profileData);

		// Save to localStorage
		$scope.status = "Saving online";
		newChildRef.set(profileData);


		// $scope.status = "Saving to local storage, for faster access";
		// localStorage.setItem(newChildRef.key(), JSON.stringify(profileData, true));

		$scope.status = "Done!, redirecting to url";
		$location.path("/profiles/" + newChildRef.key());

    };

  }]);

profileControllers.controller('ProfileDetailCtrl', ['$scope', '$routeParams','$firebaseObject','$location','Page',
  function($scope, $routeParams,$firebaseObject, $location, Page) {
    $scope.profileId = $routeParams.profileId;
	// -Ju6EG4IRy_GnAMblgaO
	$scope.info= {};
   	$scope.info['name'] = "loading...";
   	$scope.url = $location.absUrl();

    // console.log($scope.profileId, $routeParams.profileId, $scope.profileId in localStorage);

    if ($scope.profileId in localStorage) {
    	$scope.info = angular.fromJson(localStorage.getItem($scope.profileId)); // Get from localStorage
    	$(".iconX").attr("href", $scope.info.image);

    	// console.log("Got info from localStorage", $scope.info);
    } else {
    	// console.log("No localStorage found");
    }

    
    


   	Page.setTitle($scope.info['name']);

     var ref = new Firebase("https://humly.firebaseio.com/profiles/" + $scope.profileId);
     var obj = $firebaseObject(ref);


    // to take an action after the data loads, use the $loaded() promise
     obj.$loaded().then(function(snapshot) {

       angular.forEach(obj, function(value, key) {
          // console.log(key, value);
          $scope.info[key] = value;
       });
	   	Page.setTitle($scope.info['name']);
	    $(".iconX").attr("href", $scope.info.image);
	          addToHomescreen({mandatory: false, displayPace: 0});
		// console.log("updated ", $scope.info);
		localStorage.setItem($scope.profileId, angular.toJson($scope.info, true));

     });


  }]);


})();