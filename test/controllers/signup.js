var ip = "http://ip-project.ddns.net:3000";
app.controller('signup', function($scope, $http, $location){
    $scope.user = {
        'firstname' : '',
        'lastname' : '',
        'email' : '',
        'phone' : '',
        'street' : '',
        'nr' : '',
        'zipcode' : '',
        'place' : '',
        'country' : '',
        'bday' : '',
        'type' : 's',
        'school' : '',
        'class' : ''
    }
    $scope.schools = [];
    $scope.classes = [];
    
    $scope.getSchools = function(){
        // doe een http get request hier
        $scope.schools = [{_id : '16116', 'name' : 'ap'}, {_id : '4758', 'name' : 'map'}]
        // doe een http get request hier
    }
    $scope.getClasses = function(){
        // doe een http get request hier
        
        // doe een http get request hier
    }
    $scope.getSchools();
    
    $scope.changeUserType = function(){
        if($scope.user.type == 's'){
            $scope.getSchools();
        }
        else{
            $scope.schools = [];
            $scope.classes = [];
        }
    }
    $scope.changeUserSchool = function(){
        if($scope.user.school == '16116'){
            $scope.classes = [{_id : '6494', 'name' : '2ea2'}];
        }
        else{
            $scope.classes = [{_id : '6494', 'name' : '2ea3'},{_id : '6494', 'name' : '2ea1'}]
        }
    }
    $scope.showStudent = function(){
        return $scope.type == 's';
    }
    
    $scope.goToSingIn = function(){
        $location.path('/signin');
    }
    $scope.signup = function(){
        $http.post(ip + '/api/createUser', $scope.user).success(function(res){
            //alert('ok');
            
        }).error(function(err){
            //alert('err');
        });
    }
     $scope.verify = function () {
         var to = "sanjy94@gmail.com"
         if($scope.user.email != null && $scope.user.email != ""){
             $http.get(ip + "/send?to="+$scope.user.email)
             .then(function (response) {
                 $scope.myWelcome = response.data;
             console.log(response.data);
             });  
         }
        console.log($scope.user.email); 
     }
});