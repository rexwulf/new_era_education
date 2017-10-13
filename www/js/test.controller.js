var app = angular.module('test.controller', ['db.service', 'test.service']);
var ip = "http://192.168.1.10:8080";
var url = ip + "/Laravel/VGPT/public/api/v1/exams/entry";
app.controller('TestListCtrl', function($scope, DbTest, TestUpdate, $location){
  $scope.submit = function(code){
    DbTest.checkCode(code).then(function(res){
      if(!res){
        $scope.message = "Incorrect Password";
      }
      else if(res.taken){
        $scope.message = "Test Already taken!";
      }
      else if(!res.taken){
        console.log("correct test code redirecting......");
        var path = "/app/testlist/" + code;
        $location.path(path);
      }
    });
  };
  $scope.insertTest = function(){
    console.log("controller");
    TestUpdate.insertTest();
  };
});

app.controller('TestOverviewCtrl', function($scope, $stateParams, DbTest, TestData, $location, $rootScope){
  TestData.storePassword($stateParams.password);
  $scope.$on('$ionicView.enter', function() {
     console.log('Opened test overview!');
     if(TestData.dataPresent){
       $scope.questions = TestData.questions;
     }
  });
  $scope.password = $stateParams.password;
  DbTest.getTest($stateParams.password).then(function(test){
    console.log("getting test");
    var subjects = [];
    var questions = [];
    questions.push([]);
    subjects.push(test.item(0).subject);
    var qIndex = 0;
    var num = 1;
    for(var x = 0; x < test.length; x++){
      if(subjects.indexOf(test.item(x).subject) < 0){
        subjects.push(test.item(x).subject);
        qIndex++;
        questions.push([]);
        num = 1;
      }
      var q = test.item(x);
      q.review = false;
      q.userAns = null;
      q.num = num;
      num++;
      questions[qIndex].push(q);
    }
    $scope.subjects = subjects;
    $rootScope.subjects = subjects;
    $scope.questions = questions;
    TestData.storeData(questions, subjects);
  });
  var elapser = 0;
  //Code for Clock
  DbTest.getTestInfo($stateParams.password).then(function(testInfo){
    $rootScope.timeLeft = testInfo.time - testInfo.elapsedTime;
    elapser = $rootScope.timeLeft - 60000;
    $rootScope.timer = setInterval(function(){
      $rootScope.timeLeft -= 1000;
      $rootScope.testTimer = Math.floor(($rootScope.timeLeft / 60000)) + ":" + (($rootScope.timeLeft / 1000)%60);
      $scope.$apply();
      if($rootScope.timeLeft <= 0){
        $location.path("/app/endTest");
        console.log("timeout");
        //clearInterval($rootScope.timer);
      }

      //store elapsedTime every 1 min
      if($rootScope.timeLeft < elapser){
        elapser -= 60000;
        DbTest.storeTimeElapsed($stateParams.password, testInfo.time - $rootScope.timeLeft);
      }
    }, 999);
  });
  //End code for clock

  $scope.openQuestion = function(subject, qNum){
    console.log(subject + qNum);
    var path = "/app/testlist/" + $stateParams.password + "/" + subject + "/" + qNum;
    $location.path(path);
  };
});

app.controller('TestQuestionCtrl', function($scope, $stateParams, TestData, $location, $ionicPopup, $rootScope, $cordovaToast, $cordovaFileOpener2){
  var parseKatex = function(question){
    var katStr = [];
    var katCount = 0;
    var limits = [];
    String.prototype.replaceBetween = function(start, end, what) {
      return this.substring(0, start) + what + this.substring(end);
    };
    for(var l = 0; l < question.length; l++){
      if(question.charAt(l) == "`"){
        console.log("` detected`");
        var lower = l;
        var toConvert = "";
        ++l;
        while(question.charAt(l) != "`"){
          toConvert += question.charAt(l);
          l++;
        }
        var upper = l;
        limits.push([lower, upper]);
        katStr.push(katex.renderToString(toConvert, {displayMode: true}));
        katCount++;
      }
    }
    if(katStr.length){
      for(l = katStr.length-1; l >= 0; l--){
        console.log("l= " + l);
        question = question.replaceBetween(limits[l][0], limits[l][1]+1, katStr[l]);
      }
    }
    document.getElementById("jax").innerHTML = question;
  };
  var showImages = function(question){
    if(question.questionImage){
      window.plugins.Base64.encodeFile(question.questionImage, function(base64){
        console.log('img encoded for Question');
        $scope.currQImg =  base64;
      });
    }
    else{
      $scope.currQImg = false;
    }
    if(question.AImg){
      window.plugins.Base64.encodeFile(question.AImg, function(base64){
        //console.log('file base64 encoding: ' + base64);
        console.log('img encoded for A');
        $scope.currAImg =  base64;
      });
    }
    else{
      $scope.currAImg = false;
    }
    if(question.BImg){
      window.plugins.Base64.encodeFile(question.BImg, function(base64){
        //console.log('file base64 encoding: ' + base64);
        console.log('img encoded for B');
        $scope.currBImg =  base64;
      });
    }
    else{
      $scope.currBImg = false;
    }
    if(question.CImg){
      window.plugins.Base64.encodeFile(question.CImg, function(base64){
        //console.log('file base64 encoding: ' + base64);
        console.log('img encoded for C');
        $scope.currCImg =  base64;
      });
    }
    else{
      $scope.currCImg = false;
    }
    if(question.DImg){
      window.plugins.Base64.encodeFile(question.DImg, function(base64){
        //console.log('file base64 encoding: ' + base64);
        console.log('img encoded for D');
        $scope.currDImg =  base64;
      });
    }
    else{
      $scope.currDImg = false;
    }
  };
  //Code for handling visibility of next & prev button
  if(TestData.subjects.indexOf($stateParams.subject) === 0 && $stateParams.question == 1){
    $scope.prevButton = false;
  }
  else{
    $scope.prevButton = true;
  }
  if(TestData.subjects.indexOf($stateParams.subject) == TestData.subjects.length-1 && $stateParams.question == TestData.questions[TestData.subjects.indexOf($stateParams.subject)].length){
    $scope.nextButton = false;
  }
  else{
    $scope.nextButton = true;
  }
  //END Code for handling visibility of next & prev button

  $scope.question = TestData.questions[TestData.subjects.indexOf($stateParams.subject)][$stateParams.question-1];
  showImages($scope.question);
  parseKatex($scope.question.question);
  var subject = $stateParams.subject;
  var questionNum = $stateParams.question-1;
  $scope.saveQuestion = function(userAns){
    console.log("userAns =" + userAns);
    TestData.questions[TestData.subjects.indexOf(subject)][questionNum].userAns = userAns;
    TestData.questions[TestData.subjects.indexOf(subject)][questionNum].answered = true;
    TestData.storeData(TestData.questions, TestData.subjects);
    $cordovaToast.show('Saved', 'short', 'center');
  };
  $scope.reviewLater = function(){
    TestData.questions[TestData.subjects.indexOf(subject)][questionNum].review = true;
    TestData.storeData(TestData.questions, TestData.subjects);
    $cordovaToast.show('Marked for review', 'short', 'center');
  };
  $scope.unsaveQuestion = function(){
    TestData.questions[TestData.subjects.indexOf(subject)][questionNum].userAns = null;
    TestData.questions[TestData.subjects.indexOf(subject)][questionNum].answered = false;
    TestData.storeData(TestData.questions, TestData.subjects);
    $cordovaToast.show('Unsaved', 'short', 'center');
  };

  //Code for handling prev & next button
  $scope.next = function(){
    $scope.prevButton = true;
    if($scope.question.num >= TestData.questions[TestData.subjects.indexOf(subject)].length){
      var s = TestData.subjects.indexOf(subject);
      s++;
      subject = TestData.subjects[s];
      $scope.question = TestData.questions[s][0];
      showImages($scope.question);
      parseKatex($scope.question.question);
      console.log(TestData.questions[s][0].question);
      questionNum = 0;
    }
    else{
      $scope.question = TestData.questions[TestData.subjects.indexOf(subject)][questionNum+1];
      showImages($scope.question);
      parseKatex($scope.question.question);
      questionNum++;
      console.log(TestData.questions[TestData.subjects.indexOf(subject)][questionNum].question);
    }
    if(TestData.subjects.indexOf(subject) == (TestData.questions.length-1) && (questionNum+1) == TestData.questions[TestData.subjects.indexOf(subject)].length){
      $scope.nextButton = false;
    }
    else{
      $scope.nextButton = true;
    }
  };
  $scope.previous = function(){
    $scope.nextButton = true;
    if($scope.question.num <= 1){
      var s = TestData.subjects.indexOf(subject);
      s--;
      subject = TestData.subjects[s];
      var q = TestData.questions[s].length - 1;
      $scope.question = TestData.questions[s][q];
      showImages($scope.question);
      parseKatex($scope.question.question);
      console.log(TestData.questions[s][q].question);
      questionNum = q;
    }
    else{
      $scope.question = TestData.questions[TestData.subjects.indexOf(subject)][questionNum-1];
      showImages($scope.question);
      parseKatex($scope.question.question);
      questionNum--;
      console.log(TestData.questions[TestData.subjects.indexOf(subject)][questionNum].question);
    }
    if(TestData.subjects.indexOf(subject) === 0 && questionNum === 0){
      $scope.prevButton = false;
    }
    else{
      $scope.prevButton = true;
    }
  };
  //END Code for handling prev & next button
  $scope.openImage = function(link){
    console.log("link = "+link);
    $cordovaFileOpener2.open(
      link,
      "image/" + link.split(".").pop()
    ).then(function() {
        console.log("file opened");
    }, function(err) {
        console.log(err);
        var strBuilder = [];
        for(var key in err){
              if (err.hasOwnProperty(key)) {
                 strBuilder.push("Key is " + key + ", value is " + err[key] + "\n");
            }
        }
        console.log(strBuilder.join(""));
    });
  };

  $scope.showConfirm = function() {
  var confirmPopup = $ionicPopup.confirm({
    title: 'End The Test?',
    template: 'Are you sure you want submit the test?'
  });

  confirmPopup.then(function(res) {
    if(res) {
      console.log('test submitted');
      end();
    } else {
      console.log('not submitted');
    }
  });
};
  var end = function(){
    var path = "/app/endTest";
    $location.path(path);
  };
});

app.controller('TestEndCtrl', function($scope, TestData, $rootScope, DbTest, $http, DbServiceSettings){
  clearInterval($rootScope.timer);
  var subjectMarksObj = {
    physics: 0,
    chemistry: 0,
    math: 0
  };
  var questions = TestData.questions;
  var marks = 0;
  var subjectMarks = [];
  var x = 0, y = 0;
  $scope.totalCorrect = 0;
  var totalQ = 0;
  //Evaluate Test
  for(x = 0; x < questions.length; x++){
    subjectMarks.push(0);
    for(y = 0; y < questions[x].length; y++){
      ++totalQ;
      if(questions[x][y].type == "single" && questions[x][y].userAns !== null){
        subjectMarks[x] += questions[x][y].answer == questions[x][y].userAns ? questions[x][y].marks : questions[x][y].negativeMarks;
        $scope.totalCorrect += questions[x][y].answer == questions[x][y].userAns ? 1 : 0;
      }
      else if(questions[x][y].type == "multiple" && questions[x][y].userAns && questions[x][y].userAns !== null){
        var userAns = questions[x][y].answer.split(",");
        var userAnsL = 0;
        var correct = true;
        if(questions[x][y].userAns.a){
          userAnsL++;
          if(userAns.indexOf("A") < 0){
            correct = false;
          }
        }
        if(questions[x][y].userAns.b){
          userAnsL++;
          if(userAns.indexOf("B") < 0){
            correct = false;
          }
        }
        if(questions[x][y].userAns.c){
          userAnsL++;
          if(userAns.indexOf("C") < 0){
            correct = false;
          }
        }
        if(questions[x][y].userAns.d){
          userAnsL++;
          if(userAns.indexOf("D") < 0){
            correct = false;
          }
        }
        if(userAnsL != userAns.length){
          correct = false;
        }
        subjectMarks[x] += correct ? questions[x][y].marks : questions[x][y].negativeMarks;
        $scope.totalCorrect += correct ? 1 : 0;
      }
      else if(questions[x][y].type == "integer" && questions[x][y].userAns !== null){
        subjectMarks[x] += questions[x][y].answer == questions[x][y].userAns ? questions[x][y].marks : questions[x][y].negativeMarks;
        $scope.totalCorrect += questions[x][y].answer == questions[x][y].userAns  ? 1 : 0;
      }
    }
  }
//End Test Evaluater
  /*var a = 0, b = 0;
  for(a = 0; a < questions.length; a++){
    for(b = 0; b < questions[a].length; b++){
      //console.log("userAns " + questions[a][b].userAns);
      //console.log("answer " + questions[a][b].answer);
      var strBuilder = [];
      for(var key in questions[a][b]){
            if (questions[a][b].hasOwnProperty(key)) {
               strBuilder.push("Key is " + key + ", value is " + questions[a][b][key] + "\n");
          }
      }
      console.log(strBuilder.join(""));
    }
  }*/
  $scope.marks = 0;
  for(x in subjectMarks){
    $scope.marks += subjectMarks[x];
    subjectMarksObj[$rootScope.subjects[x]] = subjectMarks[x];
  }
  subjectMarksObj.physics = subjectMarksObj.physics ? subjectMarksObj.physics:0;
  subjectMarksObj.chemistry = subjectMarksObj.chemistry ? subjectMarksObj.chemistry:0;
  subjectMarksObj.math = subjectMarksObj.math ? subjectMarksObj.math:0;
  $scope.accuracy = ($scope.totalCorrect / totalQ)*100;
  console.log("physics Score="+subjectMarksObj.physics);
  console.log("chemistry="+subjectMarksObj.chemistry);
  console.log("maths="+subjectMarksObj.math);
  DbTest.editStats(TestData.password, $scope.marks, subjectMarksObj).then(function(name){
    //send data to server
    DbServiceSettings.getUserInfo().then(function(user){
      console.log("name of test = " + name);
      var userObj = {
        adm_no: user[2],
        test_name: name,
        physics_score: subjectMarksObj.physics,
        chemistry_score: subjectMarksObj.chemistry,
        math_score: subjectMarksObj.math,
        total: subjectMarksObj.math + subjectMarksObj.chemistry + subjectMarksObj.physics
      };
      var toParams = function(obj) {
          var p = [];
          for (var key in obj) {
              p.push(key + '=' + encodeURIComponent(obj[key]));
          }
          return p.join('&');
      };
      console.log(url);
      $http({
        url: "http://192.168.1.10:8080/Laravel/VGPT/public/api/v1/exams/entry",
        method: "POST",
        data: toParams(userObj),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).success(function(tests){
          DbTest.setUploaded(TestData.password);
          console.log("doneeeee");
        });
    });
  });
  $scope.subjectMarks = subjectMarks;
});
