app.controller('login', function($scope, $http, $location, $interval /*UserService,*/){
    $scope.info = {
        'text' : 'INFO BOX',
        'class' : 'info_hidden'
    }
    $scope.login = {
        'email' : '',
        'password' : ''
    }
    
    $scope.signin = function(){
        if($scope.login.email && $scope.login.password){
            $http.post(ip + '/api/loginUser', $scope.login).then(function(res){
                $scope.showInfo(res.data.text, res.data.class);
                if(res.data.succes == true){
                    //UserFact.setUser(res.data.user);
                    //console.log(UserFact.getUser());
                    if(res.data.user.type == 's'){
                        $location.path('/home');
                    }
                    else if(res.data.user.type == 'p'){
                        $location.path('/home');
                    }
                    else if(res.data.user.type == 'd'){
                        $location.path("/myclass");
                    }
                    else{
                        $location.path('/login');
                    }
                }
            }, function(err){
                $scope.showInfo('NETWORK ERROR', 'info_show info_red');
            });
        }
        else{
            $scope.showInfo('PLEASE FILL IN EVERYTHING', 'info_show info_red');
        }
    }
    $scope.goToSingUp = function(){
        $location.path('/signup');
    }
    
    $scope.showInfo = function(tx, cl){
        $scope.info.text = tx;
        $scope.info.class = cl;
        $interval(function(){
            $scope.info.class = 'info_hidden info_blue';
        }, 2000, 1);
    }
    
    // ------------------------- SIGN UP -------------------------//
    
    $scope.user = {
        'firstname' : '',
        'lastname' : '',
        'email' : '',
        'phone' : '',
        'street' : '',
        'nr' : '',
        'zipcode' : '',
        'place' : '',
        'country' : 'be',
        'bday' : '',
        'type' : 'p',
        'school' : '',
        'class' : '',
        'password' : ''
    }
    $scope.schools = [];


    $scope.getSchools = function(){
        $http.get(ip + '/api/schools', {}).success(function(schools){
            $scope.schools = schools;
        }).error(function(error){
            $scope.showInfo('ERROR WHILE GETTING THE SCHOOLS', 'info_red info_show');
        });
    }
    $scope.getClasses = function(){
        $http.get(ip + '/api/classes?schoolid=' + $scope.user.school, {}).success(function(classes){
            $scope.classes = classes;
        }).error(function(error){
            $scope.showInfo('ERROR WHILE GETTING THE CLASSES', 'info_red info_show');
        });
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
        $scope.getClasses();
    }
    $scope.showStudent = function(){
        return $scope.type == 's';
    }
    
    $scope.goToSingIn = function(){
        $location.path('/signin');
    }
    $scope.signup = function(){
        if($scope.user.firstname && $scope.user.lastname && $scope.user.email && $scope.user.phone && $scope.user.bday && $scope.user.street && $scope.user.nr && $scope.user.country && $scope.user.zipcode && $scope.user.place && $scope.user.password && $scope.password_again && $scope.user.type){
            if($scope.user.password == $scope.password_again){
                $http.post(ip + '/api/createUser', $scope.user).success(function(res){
                    $scope.showInfo(res.text, res.class);
                }).error(function(error){
                    $scope.showInfo('NETWORK ERROR', 'info_show info_red');
                });
            }
            else{
                $scope.showInfo('THE PASSWORDS ARE NOT THE SAME', 'info_show info_red');
            }
        }
        else{
            $scope.showInfo('PLEASE FILL IN EVERYTHING', 'info_show info_red');
        }
        
    }
});