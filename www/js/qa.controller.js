var app = angular.module('qa.controller', ['db.service', 'qa.service']);
app.controller('QaCtrl', function($scope){

});

app.controller('QaDirectoryCtrl', function($scope, $stateParams){
  if($stateParams.subject == "physics"){
    $scope.topicNames = ["Physics And Measurement", "Kinematics", "Laws Of Motion", "Work Energy and Power", "Rotational Motion", "Gravitation", "Properties Of Solid And Liquids", "Thermodynamics" , "Kinetic theory Of Gases", "oscillation And Waves", "Magnetic Effect of Current and Magnetism", "Electromagnetic Induction And Alternating Currents", "Electromagnetic Waves", "Optics", "Dual Nature Of Matter And Radiation", "Atoms And Nuclei", "Electronic Devices", "Communication Systems", "Modern Physics", "Electrostatics"];
    $scope.topics = ["physics_and_measurement", "kinematics", "laws_of_motion", "work_energy_and_power", "rotational_motion", "gravitation", "proprtie_of_solid_and_liquids", "thermodynamics" , "kinetic_theory_of_gases", "oscillation_and_waves", "magnetic_effect_of_current_and_magnetism", "electromagnetic_induction_and_alternating_currents", "electromagnetic_waves", "optics", "dual_nature_of_matter_and_radiation", "atoms_and_nuclei", "electrnic_devices", "communication_systems", "modern_physics", "electrostatics"];
  }
  if($stateParams.subject == "chemistry"){
    $scope.topicNames = ["Some Basics Concepts Of Chemistry", "States Of Matter", "Atomic Structure", "Chemical Bonding And Molecular Structure", "Chemical Thermodynamics", "The Solid State", "Solutions", "Electrochemistry", "Chemical Kinetics", "Surface Chemistry", "General Principle And Process Of Isolation Of Elements", "The P block Elements", "The D and F Block Elements", "Coordination Compounds", "Redox Reaction", "Hydrogen", "The S Block Elements", "The P Block Elements", "Organic Chemistry", "Hydrocarbons", "Environmental Chemistry"];
    $scope.topics = ["some_basic_concept_in_chemistry", "states_of_matter", "atomic_structure", "chemical_bonding_and_molecular_structure", "chemical_thermodynamics", "the_solid_state", "solutions", "electrochemistry", "chemical_kinetics", "surface_chemistry", "general_principles_and_process_of_isolation_of_elemnts", "the_p_block_elements", "the_d_and_f_block_elements", "coordination_compounds", "redox_reactions", "hydrogen", "the_s_block_elements", "the_p_block_elements", "organic_chemistry", "hydrocarbons", "environmental_chemistry"];
  }
  if($stateParams.subject == "maths"){
    $scope.topicNames = [ "Set Relation And Function", "Complex Numbers", "Equation And Inequalities", "Sequence And Series", "Permutation And Combunations", "Binomial Theorm And Mathematical induction", "Matrices And Determinants", "Trignometric Identities Equations", "Inverse Trignometric Functions", "Properties Of Triangle", "Height And Distances", "Rectangular Cartesian Coordinates", "Straight Line And Pair Of Straight Lines", "Circle And System Of Circles", "Conic Section", "Limits,Continuity And Differentiability", "Differentiation", "Application Of Derviatives", "Indefinite Integrals", "Definite Integrals", "Differential Equations", "Vector Algebra", "3D Geometry", "Statistics", "Probability", "Mathematical Logic And Boolean Algebra", "Linear Programming", "Statics And Dynamics"];
    $scope.topics = ["set_relations_and_functions", "complex_numbers", "equation_and_inequalities", "sequences_and_series", "permutation_and_combinations", "binomial_theorm_and_mathematical_induction", "matrices_and_determinants", "trignometric_identities_equations", "inverse_trignometric_functions", "properties_of_triangle", "heights_and_distances", "rectangular_cartesian_coordinates", "straight_line_and_pair_of_straight_lines", "circle_and_system_of_circles", "conic_section", "limits_continuity_and_differentiability", "differentiation", "application_of_derivatives", "indefinite_integrals", "definite_integrals", "differential_equations", "vector_algebra", "3d_gemotry", "statistics", "probability", "mathematical_logic_and_Boolean_algebra", "linear_programming", "statics_and_dynamics"];
  }
  $scope.subject = $stateParams.subject;
  console.log($scope.subject);
});

app.controller('QaStatsCtrl', function($scope){

});

app.controller('QaGameCtrl', function($scope, $rootScope, $stateParams, DbQuestions, QaStorage, $state, $timeout, $cordovaToast, $cordovaFileOpener2){
  $scope.currPoints = 0;
  var totalCorrect = 0;
  var totalWrong = 0;
  var skip = 0;
  String.prototype.replaceBetween = function(start, end, what) {
    return this.substring(0, start) + what + this.substring(end);
  };
  var katexConvertor = function(str){
    var katStr = [];
    var katCount = 0;
    var limits = [];
    for(var l = 0; l < str.length; l++){
      if(str.charAt(l) == "`"){
        console.log("` detected`");
        var lower = l;
        var toConvert = "";
        ++l;
        while(str.charAt(l) != "`"){
          toConvert += str.charAt(l);
          l++;
        }
        var upper = l;
        limits.push([lower, upper]);
        katStr.push(katex.renderToString(toConvert, {displayMode: true}));
        katCount++;
        console.log("katCount = " + katCount);
      }
    }
    if(katStr.length){
      for(l = katStr.length-1; l >= 0; l--){
        console.log("l= " + l);
        str = str.replaceBetween(limits[l][0], limits[l][1]+1, katStr[l]);
      }
      return str;
    }
    else{
      return str;
    }
  };
  var Question = function(q){
    this.currAns = false;
    this.userAns = "skip";
    this.subject = $stateParams.subject;
    this.question = katexConvertor(q.question);
    this.questionImage = q.questionImage;
    this.topic = $stateParams.topic;
    this.open = function(){
      $cordovaFileOpener2.open(
        q.questionImage,
        "image/" + q.questionImage.split(".").pop()
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
    this.a = katexConvertor(q.A);
    this.b = katexConvertor(q.B);
    this.c = katexConvertor(q.C);
    this.d = katexConvertor(q.D);
    this.AImg = q.AImg;
    this.BImg = q.BImg;
    this.CImg = q.CImg;
    this.DImg = q.DImg;
    this.answer = q.answer;
    this.wrong = q.wrong;
    this.correct = 0;
    this.level = DbQuestions.level;
  };

  //Knuth Algo for array shuffle
  var shuffle = function(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  };
  //end array shuffle
  console.log("subject = " + $stateParams.subject);
  $rootScope.topic = $stateParams.topic;
  DbQuestions.getQuestions($stateParams.subject, $stateParams.topic).then(function(){ //Get questions from db
    $scope.currLevel = DbQuestions.level;
    switch (DbQuestions.level) {
      case 0:
        skip = -1;
        break;
      case 1:
        skip = -2;
        break;
      case 2:
        skip = -10;
        break;
      case 3:
        skip = -50;
        break;
      case 4:
        skip = -100;
        break;
      default:
        console.log("error in level (skip marking)");
    }
    console.log("got back");
    var cards = [];
    console.log("no. of questions = " + DbQuestions.questions.length);
    if(DbQuestions.questions.length >= 1){
      /*for(var x = 0; x < DbQuestions.questions.length; x++)
        cards.push(new Question(DbQuestions.questions.item(x)));*/
      DbQuestions.level = parseInt(DbQuestions.level);
      var maxPlay = 0;
      for(var x = 0; x < DbQuestions.questions.length; x++){
        //if(DbQuestions.questions.item(x).compulsory){
          cards.push(new Question(DbQuestions.questions.item(x)));
          ++inPlay;
      //}
      }
      switch(DbQuestions.level){
        case 0:
          maxPlay = 50;
          if(cards.length > 50){
            cards = cards.slice(0, 50);
          }
          break;
        case 1:
          maxPlay = 20;
          if(cards.length > 20){
            cards = cards.slice(0, 20);
          }
          break;
        case 2:
          maxPlay = 10;
          if(cards.length > 10){
            cards = cards.slice(0, 10);
          }
          break;
        case 3:
          if(cards.length > 10){
            cards = cards.slice(0, 10);
          }
          maxPlay = 10;
          break;
        default:
          console.log("error in level");
      }
      var inPlay = 0;
      cards = shuffle(cards);

      /*var randArr = [];
      if (inPlay < maxPlay) {
        for(x = 0; x < DbQuestions.questions.length; x++){
          if(!DbQuestions.questions.item(x).compulsory){
            randArr.push(new Question(DbQuestions.questions.item(x)));
          }
        }
      }*/
      /*
      while(inPlay < maxPlay){
        var r = Math.random() * randArr.length;
        cards.push(new Question(randArr[r]));
        randArr.splice(r, 1);
        inPlay += 1;
      }*/
      var prevTime;
      switch(DbQuestions.level){
        case 0:
          for(x = 0; x < cards.length; x++){
            cards[x].timing = 5*60*1000;
            cards[x].ppoints = cards[x].wrong > 0 ? 5 : 10;
            cards[x].npoints = -2;
            prevTime = 5*60*1000;
            //console.log("set lvl 0");
          }
          console.log("set lvl 0");
          break;
        case 1:
          for(x = 0; x < cards.length; x++){
            cards[x].timing = 10*60*1000;
            cards[x].ppoints = cards[x].wrong > 0 ? 10 : 25;
            cards[x].npoints = -5;
            prevTime = 10*60*1000;
          }
          //console.log("set lvl 1");
          break;
        case 2:
          for(x = 0; x < cards.length; x++){
            cards[x].timing = 15*60*1000;
            cards[x].ppoints = cards[x].wrong > 0 ? 50 : 100;
            cards[x].npoints = -25;
            prevTime = 15*60*1000;
          }
          console.log("set lvl 2");
          break;
        case 3:
          for(x = 0; x < cards.length; x++){
            cards[x].timing = 20*60*1000;
            cards[x].ppoints = cards[x].wrong > 0 ? 300 : 500;
            cards[x].npoints = -200;
            prevTime = 20*60*1000;
          }
          console.log("set lvl 3");
          break;
        case 4:
          for(x = 0; x < cards.length; x++){
            cards[x].timing = 25*60*1000;
            cards[x].ppoints = cards[x].wrong > 0 ? 500 : 1000;
            cards[x].npoints = -100;
            prevTime = 25*60*1000;
          }
          break;
        default:
          console.log("error in points config");
          break;
      }
      $scope.totalCards = cards.length;
      $scope.counter = 0;
      $scope.card = cards[$scope.counter];
      if($scope.card.questionImage){
        console.log("question has img = " + $scope.card.questionImage);
        window.plugins.Base64.encodeFile($scope.card.questionImage, function(base64){
          console.log('file base64 encoding done');
          $scope.currQImg =  base64;
        });
      }
      if($scope.card.AImg){
        console.log("A has img = " + $scope.card.AImg);
        window.plugins.Base64.encodeFile($scope.card.AImg, function(base64){
          //console.log('file base64 encoding: ' + base64);
          $scope.currAImg =  base64;
        });
      }
      if($scope.card.BImg){
        console.log("B has img = " + $scope.card.BImg);
        window.plugins.Base64.encodeFile($scope.card.BImg, function(base64){
          //console.log('file base64 encoding: ' + base64);
          $scope.currBImg =  base64;
        });
      }
      if($scope.card.CImg){
        console.log("C has img = " + $scope.card.CImg);
        window.plugins.Base64.encodeFile($scope.card.CImg, function(base64){
          //console.log('file base64 encoding: ' + base64);
          $scope.currCImg =  base64;
        });
      }
      if($scope.card.DImg){
        console.log("D has img = " + $scope.card.DImg);
        window.plugins.Base64.encodeFile($scope.card.DImg, function(base64){
          //console.log('file base64 encoding: ' + base64);
          $scope.currDImg =  base64;
        });
      }
      //katex
      /*var katStr = [];
      var katCount = 0;
      var limits = [];
      String.prototype.replaceBetween = function(start, end, what) {
        return this.substring(0, start) + what + this.substring(end);
      };
      for(var l = 0; l < $scope.card.question.length; l++){
        if($scope.card.question.charAt(l) == "`"){
          console.log("` detected`");
          var lower = l;
          var toConvert = "";
          ++l;
          while($scope.card.question.charAt(l) != "`"){
            toConvert += $scope.card.question.charAt(l);
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
          $scope.card.question = $scope.card.question.replaceBetween(limits[l][0], limits[l][1]+1, katStr[l]);
        }
      }*/
      document.getElementById("jax").innerHTML = $scope.card.question;
      document.getElementById("a").innerHTML = $scope.card.a;
      document.getElementById("b").innerHTML = $scope.card.b;
      document.getElementById("c").innerHTML = $scope.card.c;
      document.getElementById("d").innerHTML = $scope.card.d;
      console.log($scope.card.question);
      $rootScope.timeout = $timeout(function(){
        $scope.next(false);
        console.log("timeout");
      }, $scope.card.timing);
      $scope.card.timing /= 1000;
      var timer = setInterval(function(){
        $scope.card.timing -= 1;
        $scope.$apply();
      }, 1000);
      $scope.next = function(userAns){
        if(userAns == $scope.card.answer){
          $scope.card.correct = 1;
          $scope.currPoints += $scope.card.ppoints;
          totalCorrect++;
          $cordovaToast.showWithOptions({
            message: "Correct",
            duration: "short", // 2000 ms
            position: "bottom",
            styling: {
              opacity: 0.75, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
              backgroundColor: '#008000', // make sure you use #RRGGBB. Default #333333
              textColor: '#FFFFFF', // Ditto. Default #FFFFFF
              textSize: 13, // Default is approx. 13.
              cornerRadius: 20, // minimum is 0 (square). iOS default 20, Android default 100
              horizontalPadding: 50, // iOS default 16, Android default 50
              verticalPadding: 30 // iOS default 12, Android default 30
            }
          });
        }
        else if(!userAns){
          totalWrong++;
          $scope.currPoints += $scope.card.npoints;
          $cordovaToast.showWithOptions({
            message: "Skipped",
            duration: "short", // 2000 ms
            position: "bottom",
            styling: {
              opacity: 0.75, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
              backgroundColor: '#ff0000', // make sure you use #RRGGBB. Default #333333
              textColor: '#FFFFFF', // Ditto. Default #FFFFFF
              textSize: 13, // Default is approx. 13.
              cornerRadius: 20, // minimum is 0 (square). iOS default 20, Android default 100
              horizontalPadding: 50, // iOS default 16, Android default 50
              verticalPadding: 30 // iOS default 12, Android default 30
            }
          });
        }
        else{
          totalWrong++;
          $scope.currPoints += $scope.card.npoints;
          $cordovaToast.showWithOptions({
            message: "Wrong",
            duration: "short", // 2000 ms
            position: "bottom",
            styling: {
              opacity: 0.75, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
              backgroundColor: '#ff0000', // make sure you use #RRGGBB. Default #333333
              textColor: '#FFFFFF', // Ditto. Default #FFFFFF
              textSize: 13, // Default is approx. 13.
              cornerRadius: 20, // minimum is 0 (square). iOS default 20, Android default 100
              horizontalPadding: 50, // iOS default 16, Android default 50
              verticalPadding: 30 // iOS default 12, Android default 30
            }
          });
        }
        $scope.currQImg = false;
        $scope.currAImg = false;
        $scope.currBImg = false;
        $scope.currCImg = false;
        $scope.currDImg = false;
        $timeout.cancel($rootScope.timeout);
        clearInterval(timer);
        $scope.card = cards[++$scope.counter];
        console.log($scope.card.question);
        if($scope.card.questionImage){
          console.log("question has img = " + $scope.card.questionImage);
          window.plugins.Base64.encodeFile($scope.card.questionImage, function(base64){
            console.log('file base64 encoding done');
            $scope.currQImg =  base64;
          });
        }
        if($scope.card.AImg){
          console.log("A has img = " + $scope.card.AImg);
          window.plugins.Base64.encodeFile($scope.card.AImg, function(base64){
            //console.log('file base64 encoding: ' + base64);
            $scope.currAImg =  base64;
          });
        }
        if($scope.card.BImg){
          console.log("B has img = " + $scope.card.BImg);
          window.plugins.Base64.encodeFile($scope.card.BImg, function(base64){
            //console.log('file base64 encoding: ' + base64);
            $scope.currBImg =  base64;
          });
        }
        if($scope.card.CImg){
          console.log("C has img = " + $scope.card.CImg);
          window.plugins.Base64.encodeFile($scope.card.CImg, function(base64){
            //console.log('file base64 encoding: ' + base64);
            $scope.currCImg =  base64;
          });
        }
        if($scope.card.DImg){
          console.log("D has img = " + $scope.card.DImg);
          window.plugins.Base64.encodeFile($scope.card.DImg, function(base64){
            //console.log('file base64 encoding: ' + base64);
            $scope.currDImg =  base64;
          });
        }
        //console.log($scope.card.questionImage);
        cards[$scope.counter-1].userAns = userAns;
        console.log(cards[$scope.counter-1].userAns);
        //$scope.userAns = false;
        /*var katStr = [];
        var katCount = 0;
        var limits = [];
        String.prototype.replaceBetween = function(start, end, what) {
          return this.substring(0, start) + what + this.substring(end);
        };
        for(var l = 0; l < $scope.card.question.length; l++){
          if($scope.card.question.charAt(l) == "`"){
            console.log("` detected`");
            var lower = l;
            var toConvert = "";
            ++l;
            while($scope.card.question.charAt(l) != "`"){
              toConvert += $scope.card.question.charAt(l);
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
            $scope.card.question = $scope.card.question.replaceBetween(limits[l][0], limits[l][1]+1, katStr[l]);
          }
        }*/
        document.getElementById("jax").innerHTML = $scope.card.question;
        document.getElementById("a").innerHTML = $scope.card.a;
        document.getElementById("b").innerHTML = $scope.card.b;
        document.getElementById("c").innerHTML = $scope.card.c;
        document.getElementById("d").innerHTML = $scope.card.d;
        $scope.card.timing = prevTime;
        $rootScope.timeout = $timeout(function(){
          if($scope.counter < DbQuestions.questions.length - 1){
            $scope.next(false);
          }
          else {
            $scope.end(false);
          }
          console.log("timeout");
        }, prevTime);
        $scope.card.timing /= 1000;
        timer = setInterval(function(){
          $scope.card.timing -= 1;
          $scope.$apply();
        }, 1000);
      };
      $scope.prev = function(){
        /*$ionicModal.fromTemplateUrl('templates/prevQuestion.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal = modal;
        });
        $scope.openModal = function() {
          $scope.modal.show();
        };
        //fx for closing model
        $scope.closeModal = function() {
          $scope.modal.hide();
        };
        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
          $scope.modal.remove();
        });
        $scope.$on('modal.hidden', function() {
          // Execute action
        });
        $scope.prevModal = {};*/
        if($scope.counter > 0){
          /*$scope.currQImg = false;
          $scope.currAImg = false;
          $scope.currBImg = false;
          $scope.currCImg = false;
          $scope.currDImg = false;*/
          $timeout.cancel($rootScope.timeout);
          clearInterval(timer);
          var prevCard = cards[--$scope.counter];
          if(prevCard.correct){
            prevCard.npoints = -(prevCard.ppoints + prevCard.npoints);
            prevCard.ppoints = 0;
          }
          else{
            prevCard.ppoints = Math.floor(prevCard.ppoints / 2);
            prevCard.npoints = Math.floor(prevCard.npoints / 2);
          }
          $scope.card = prevCard;
          $scope.currAImg = false;
          $scope.currBImg = false;
          $scope.currCImg = false;
          $scope.currDImg = false;
          $scope.currQImg = false;
          if($scope.card.questionImage){
            window.plugins.Base64.encodeFile($scope.card.questionImage, function(base64){
              //console.log('file base64 encoding: ' + base64);
              $scope.currQImg =  base64;
            });
          }
          if($scope.card.AImg){
            window.plugins.Base64.encodeFile($scope.card.AImg, function(base64){
              //console.log('file base64 encoding: ' + base64);
              $scope.currAImg =  base64;
            });
          }
          if($scope.card.BImg){
            window.plugins.Base64.encodeFile($scope.card.BImg, function(base64){
              //console.log('file base64 encoding: ' + base64);
              $scope.currBImg =  base64;
            });
          }
          if($scope.card.CImg){
            window.plugins.Base64.encodeFile($scope.card.CImg, function(base64){
              //console.log('file base64 encoding: ' + base64);
              $scope.currCImg =  base64;
            });
          }
          if($scope.card.DImg){
            window.plugins.Base64.encodeFile($scope.card.DImg, function(base64){
              //console.log('file base64 encoding: ' + base64);
              $scope.currDImg =  base64;
            });
          }
          $scope.card.timing = prevTime;
          $rootScope.timeout = $timeout(function(){
            if($scope.counter < DbQuestions.questions.length - 1){
              $scope.next(false);
            }
            else {
              $scope.end(false);
            }
            console.log("timeout");
          }, $scope.card.timing);
          $scope.card.timing /= 1000;
          timer = setInterval(function(){
            $scope.card.timing -= 1;
            $scope.$apply();
          }, 1000);
        }
      };
      $scope.end = function(userAns){
        console.log("ending game");
        cards[$scope.counter].userAns = userAns;
        QaStorage.storeQuestions(cards, DbQuestions.level);
        $state.go('app.qaGameEnd');
      };
      $scope.bookmark = function(){
        DbQuestions.bookmark(cards[$scope.counter]).then(function(bookmarked){
          console.log("bookmarked");
          $cordovaToast.show('Bookmark Saved', 'short', 'center');
        });
      };
    }
    else{
      $cordovaToast
      .show('No Questions in this category yet!', 'long', 'center')
      .then(function(success) {
        // success
      }, function (error) {
        // error
      });
    }
  });
});

app.controller('QaEndCtrl', function($scope, QaStorage, DbQuestions, PointsEditor, $rootScope, $timeout){
  $timeout.cancel($rootScope.timeout);
  $scope.questions = QaStorage.q;
  $scope.correct = 0;
  $scope.wrong = 0;
  $scope.points = 0;
  var skip = 0, wrongQuestions = [], wrongArr = [];

  //Specify the -ve marking for not answering
  switch (QaStorage.level) {
    case 0:
      skip = -1;
      break;
    case 1:
      skip = -2;
      break;
    case 2:
      skip = -10;
      break;
    case 3:
      skip = -50;
      break;
    case 4:
      skip = -100;
      break;
    default:
      console.log("error in level (skip marking)");
  }
  var compulsoryQ = [];
  for(var y = 0; y < QaStorage.q.length; y++){
    if(QaStorage.q[y].userAns == "skip"){
      QaStorage.q = QaStorage.q.slice(0, y);
    }
  }
  for(var x = 0; x < QaStorage.q.length; x++){
    console.log(QaStorage.q[x].answer);
    if(QaStorage.q[x].answer == QaStorage.q[x].userAns){
      $scope.correct++;
      $scope.points += QaStorage.q[x].ppoints;
      if(QaStorage.q[x].compulsory){
        compulsoryQ.push(QaStorage.q[x].question);
      }
    }
    else {
      $scope.wrong++;
      wrongArr.push(++QaStorage.q[x].wrong);
      $scope.points += QaStorage.q[x].userAns ? QaStorage.q[x].npoints : skip;
      wrongQuestions.push(QaStorage.q[x].question);
    }
  }
  $scope.levelUp = false;
  $scope.levelDown = false;
  console.log("correct " + $scope.correct);
  console.log("wrong " + $scope.wrong);
  console.log("points " + $scope.points);
  switch (QaStorage.level) {
    case 0:
      /*if($scope.correct == QaStorage.q.length){
        $scope.levelUp = true;
      }*/
      if($scope.correct/parseFloat(QaStorage.q.length) >= 0.7){
        $scope.levelUp = true;
      }
      break;
    case 1:
      /*if($scope.correct > 2){
        for(x = 2; x < QaStorage.q.length; x++){
          if(QaStorage.q[x-2].userAns == QaStorage.q[x-2].answer && QaStorage.q[x-1].userAns == QaStorage.q[x-1].answer && QaStorage.q[x].userAns == QaStorage.q[x].answer){
            $scope.levelUp = true;
            break;
          }
        }
      }
      if($scope.wrong > 3){
        for(x = 3; x < QaStorage.q.length; x++){
          if(QaStorage.q[x-3].userAns != QaStorage.q[x-3].answer && QaStorage.q[x-2].userAns != QaStorage.q[x-2].answer && QaStorage.q[x-1].userAns != QaStorage.q[x-1].answer && QaStorage.q[x].userAns != QaStorage.q[x].answer){
            $scope.levelDown = true;
            break;
          }
        }
      }*/
      if($scope.correct/parseFloat(QaStorage.q.length) >= 0.6){
        $scope.levelUp = true;
      }
      else if($scope.correct/parseFloat(QaStorage.q.length) <= 0.20){
        $scope.levelDown = true;
      }
      break;
    case 2:
      /*if($scope.correct > 2){
        for(x = 2; x < QaStorage.q.length; x++){
          if(QaStorage.q[x-2].userAns == QaStorage.q[x-2].answer && QaStorage.q[x-1].userAns == QaStorage.q[x-1].answer && QaStorage.q[x].userAns == QaStorage.q[x].answer){
            $scope.levelUp = true;
            break;
          }
        }
      }
      if($scope.wrong > 2){
        for(x = 2; x < QaStorage.q.length; x++){
          if(QaStorage.q[x-2].userAns != QaStorage.q[x-2].answer && QaStorage.q[x-1].userAns != QaStorage.q[x-1].answer && QaStorage.q[x].userAns != QaStorage.q[x].answer){
            $scope.levelDown = true;
            break;
          }
        }
      }*/
      if($scope.correct/parseFloat(QaStorage.q.length) >= 0.5){
        $scope.levelUp = true;
      }
      else if($scope.correct/parseFloat(QaStorage.q.length) <= 0.15){
        $scope.levelDown = true;
      }
      break;
    case 3:
      /*if($scope.correct > 2){
        for(x = 2; x < QaStorage.q.length; x++){
          if(QaStorage.q[x-2].userAns == QaStorage.q[x-2].answer && QaStorage.q[x-1].userAns == QaStorage.q[x-1].answer && QaStorage.q[x].userAns == QaStorage.q[x].answer){
            $scope.levelUp = true;
            break;
          }
        }
      }
      if($scope.wrong > 2){
        for(x = 2; x < QaStorage.q.length; x++){
          if(QaStorage.q[x-2].userAns != QaStorage.q[x-2].answer && QaStorage.q[x-1].userAns != QaStorage.q[x-1].answer && QaStorage.q[x].userAns != QaStorage.q[x].answer){
            $scope.levelDown = true;
            break;
          }
        }
      }*/
      if($scope.correct/parseFloat(QaStorage.q.length) >= 0.4){
        $scope.levelUp = true;
      }
      else if($scope.correct/parseFloat(QaStorage.q.length) <= 0.15){
        $scope.levelDown = true;
      }
      break;
    case 4:
      /*if($scope.wrong > 2){
        for(x = 2; x < QaStorage.q.length; x++){
          if(QaStorage.q[x-2].userAns != QaStorage.q[x-2].answer && QaStorage.q[x-1].userAns != QaStorage.q[x-1].answer && QaStorage.q[x].userAns != QaStorage.q[x].answer){
            $scope.levelDown = true;
            break;
          }
        }
      }*/
      if($scope.correct/parseFloat(QaStorage.q.length) <= 0.1){
        $scope.levelDown = true;
      }
      break;
    default:
      console.log("level detection error");
  }
  PointsEditor.appendPointsForGame($scope.points, QaStorage.q[0].subject, QaStorage.q[0].topic, $scope.correct, $scope.wrong).then(function(result){
    console.log("appended all points");
  });
  //$scope.levelUp = ($scope.levelDown && $scope.levelUp) ? false : true;
  if($scope.levelUp){
    DbQuestions.changeLevel(++QaStorage.level, $rootScope.topic).then(function(result){
      console.log("changed level++");
      console.log("level up = " + $scope.levelUp);
      console.log("level down = " + $scope.levelDown);
    });
  }
  else if($scope.levelDown){
    DbQuestions.changeLevel(--QaStorage.level, $rootScope.topic).then(function(result){
      console.log("changed level--");
      console.log("level up = " + $scope.levelUp);
      console.log("level down = " + $scope.levelDown);
    });
  }
  if(compulsoryQ.length){
    DbQuestions.removeCompulsory(compulsoryQ, QaStorage.q[0].subject);
  }
  if(wrongQuestions.length)
    DbQuestions.addWrong(wrongQuestions, wrongArr, QaStorage.q[0].subject);
});
