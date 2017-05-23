app.controller('myclass', function($scope, $location, $http, UserFact){
    $scope.selectedClassId = 'select';
    $scope.students = [];
    $scope.user = UserFact.getUser();
    $scope.list = [
        {_id : 0000, act : 0, temp : 0, act_av : 0, temp_av : 0, name : 'Error while loading students.'}
    ];
    
    // ------------------------- Get Klassen ------------------------- //
    $scope.klassen = [{name : 'loading classes'}];
    $scope.getKlassen = function(){
        $http.post(ip + '/api/getClasses', {}).success(function(result){
            if(result.succes == true){
                $scope.klassen = result.classes;
            }
            else{
                alert('cannot get classes');
            }
        })
        .error(function(error){
            $scope.klassen = [{name : 'error while loading classes'}];
        });
    }
    $scope.getKlassen();
    
    // ------------------------- Klas studenten ------------------------- //
    $scope.getMyClass = function(){
        //http post of get here
    }
    $scope.getMyClass();
    
    $scope.goToStudentDetail = function(id){
        $location.path('/student/' + id + "/" + $scope.avrTemp($scope.students) + "/" + $scope.avrMov($scope.students));
    }
    // ------------------------- NIEUWE KLAS ------------------------- //
    $scope.nieuweKlasClass = {};
    //Open de popup scherm
    $scope.openNieuweKlas = function(){
        $scope.nieuweKlasClass = {
            back : 'open_back index_3',
            front : 'open index_4'
        };
    }
    $scope.nieuweKlas = {};
    //Sluit het popup scherm
    $scope.closeNieweKlas = function(){
        $scope.nieuweKlasClass = {
            back : 'closed',
            front : 'closed'
        };
        $scope.nieuweKlas = {};
    }
    $scope.closeNieweKlas();
    $scope.makeEmptyClass = function(){
        $scope.nieuweKlas = {
            name : ''
        };
    }
    $scope.makeEmptyClass();
    
    $scope.postNewClass = function(){
        if($scope.nieuweKlas.name){
            $http.post(ip + '/api/addClass', $scope.nieuweKlas).success(function(result){
                if(result.succes == true){
                    $scope.closeNieweKlas();
                    $scope.getKlassen();
                }
                else{
                    $scope.getKlassen();
                }
            }).error(function(error){
                alert('error');
            });
        }
        else{
            alert('a');
        }
    }
    // ------------------------- NIEUWE STUDENT ------------------------- //
    $scope.nieuweStudentClass = {};
    $scope.openNieuweStudent = function(){
        $scope.nieuweStudentClass = {
            back : 'open_back index_1',
            front : 'open index_2'
        };
    }
    $scope.closeNieuweStudent = function(){
        $scope.nieuweStudentClass = {
            back : 'closed',
            front : 'closed'
        };
    }
    $scope.closeNieuweStudent();
    
    $scope.newStudent = {};
    $scope.makeNewStudent = function(){
        $scope.newStudent = {
            firstname : '',
            lastname : '',
            classId : ''
        };
    }
    $scope.makeNewStudent();
    
    $scope.addNewStudent = function(){
        if($scope.newStudent.firstname && $scope.newStudent.lastname && $scope.newStudent.classId){
            $http.post(ip + '/api/addStudent', $scope.newStudent).success(function(result){
                if(result.succes){
                    alert('ok');
                }
                else{
                    alert('n');
                }
                $scope.getStudents();
            }).error(function(error){
                alert('error');
            });
        }
    }
    $scope.avrTemp = function(a){
        var d = 0;
        var b = 0;
        for(var i = 0; i < a.length; i ++){
            if(a[i].temp != undefined) b += a[i].temp;
            else b += 0;
            if(a[i].temp == 0 || a[i].temp == undefined) d++;
        }
        b /= (a.length - d);
        return parseFloat(b.toFixed(2));
    }
    $scope.avrMov = function(a){
        var b = 0;
        var d = 0;
        for(var i = 0; i < a.length; i ++){
            if(a[i].data != undefined) b += a[i].data;
            else b += 0;
            if(a[i].data == 0 || a[i].data == undefined) d++;
        }
        b /= ((a.length - d));
        return parseInt(b);
    }
    $scope.getStudents = function () {
        if($scope.selectedClassId != "select"){
            $http.post(ip + '/api/getStudents', {classId : $scope.selectedClassId}).success(function (result) {
                if (result.succes == true) {
                    $scope.students = result.students;
                    for (var aq = 0; aq < $scope.students.length; aq++) {
                        
                        $scope.students[aq].data = 0;
                        $http.get(ip + '/api/data?nmr=' + aq + '&id=' + $scope.students[aq]._id).success(function (res) {
                            var _res = 0;
                            var _rtmp = 0;
                            for (var j = 0; j < res.body.feeds.length; j++) {
                                var _1 = parseInt(res.body.feeds[j].field1);
                                var _2 = parseInt(res.body.feeds[j].field2);
                                var _3 = parseInt(res.body.feeds[j].field3);
                                //var _2assen = Math.sqrt(Math.pow(res.body.feeds[j].field1, 2) + Math.pow(res.body.feeds[j].field2, 2));
                                //var _3assen = Math.sqrt(Math.pow(_2assen, 2) + Math.pow(res.body.feeds[j].field3, 2));
                                var _3assen = parseInt((_1 + _2 + _3) / 3);
                                var _tmp = res.body.feeds[j].field4;
                                _res += _3assen;
                                
                                _rtmp += parseFloat(_tmp);
                            }
                            _res = Math.floor(_res /= res.body.feeds.length);
                            _rtmp /= res.body.feeds.length;
                            $scope.students[res.number].data = _res;
                            $scope.students[res.number].temp = parseFloat(_rtmp.toFixed(2));
                        });
                    }
                }
                else{
                    alert('error while getting students');
                }
            }).error(function(error){
                alert('error');
            });
        }
    }
    $scope.getStudents();
    $scope.classChange = function(){
        $scope.getStudents();
    }
    $scope.classSelect = function(a){
        $scope.selectedClassId = a;
        $scope.getStudents();
    }
    $scope.test = function(){
        //$http.post(ip + '/api/getTotalClassData', {classId : "59147c93797ce13dbcfd52ff"}).success(function(res){
            
        //});
    }
    $scope.test();
});