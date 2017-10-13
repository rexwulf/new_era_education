var app = angular.module('bookmark.controller', ['db.service']);
app.controller('BookmarkCtrl', function($scope, DbBookmarks){
  console.log("bookmarks");
});

app.controller('BookmarkTopicsCtrl', function($scope, $stateParams){
  console.log($stateParams.subject);
  if($stateParams.subject == "physics"){
    $scope.topicNames = ["Physics And Measurement", "Kinematics", "Laws Of Motion", "Work Energy and Power", "Rotational Motion", "Gravitation", "Properties Of Solid And Liquids", "Thermodynamics" , "Kinetic theory Of Gases", "oscillation And Waves", "Magnetic Effect of Current and Magnetism", "Electromagnetic Induction And Alternating Currents", "Electromagnetic Waves", "Optics", "Dual Nature Of Matter And Radiation", "Atoms And Nuclei", "Electronic Devices", "Communication Systems", "Modern Physics", "Electrostatics"];
    $scope.topics = ["physics_and_measurement", "kinematics", "laws_of_motion", "work_energy_and_power", "rotational_motion", "gravitation", "proprtie_of_solid_and_liquids", "thermodynamics" , "kinetic_theory_of_gases", "oscillation_and_waves", "magnetic_effect_of_current_and_magnetism", "electromagnetic_induction_and_alternating_currents", "electromagnetic_waves", "optics", "dual_nature_of_matter_and_radiation", "atoms_and_nuclei", "electrnic_devices", "communication_systems", "modern_physics", "electrostatics"];
  }
  else if($stateParams.subject == "chemistry"){
    $scope.topicNames = ["Some Basics Concepts Of Chemistry", "States Of Matter", "Atomic Structure", "Chemical Bonding And Molecular Structure", "Chemical Thermodynamics", "The Solid State", "Solutions", "Electrochemistry", "Chemical Kinetics", "Surface Chemistry", "General Principle And Process Of Isolation Of Elements", "The P block Elements", "The D and F Block Elements", "Coordination Compounds", "Redox Reaction", "Hydrogen", "The S Block Elements", "The P Block Elements", "Organic Chemistry", "Hydrocarbons", "Environmental Chemistry"];
    $scope.topics = ["some_basic_concept_in_chemistry", "states_of_matter", "atomic_structure", "chemical_bonding_and_molecular_structure", "chemical_thermodynamics", "the_solid_state", "solutions", "electrochemistry", "chemical_kinetics", "surface_chemistry", "general_principles_and_process_of_isolation_of_elemnts", "the_p_block_elements", "the_d_and_f_block_elements", "coordination_compounds", "redox_reactions", "hydrogen", "the_s_block_elements", "the_p_block_elements", "organic_chemistry", "hydrocarbons", "environmental_chemistry"];
  }
  else if($stateParams.subject == "maths"){
    $scope.topicNames = ["Set Relation And Function", "Complex Numbers", "Equation And Inequalities", "Sequence And Series", "Permutation And Combunations", "Binomial Theorm And Mathematical induction", "Matrices And Determinants", "Trignometric Identities Equations", "Inverse Trignometric Functions", "Properties Of Triangle", "Height And Distances", "Rectangular Cartesian Coordinates", "Straight Line And Pair Of Straight Lines", "Circle And System Of Circles", "Conic Section", "Limits,Continuity And Differentiability", "Differentiation", "Application Of Derviatives", "Indefinite Integrals", "Definite Integrals", "Differential Equations", "Vector Algebra", "3D Geometry", "Statistics", "Probability", "Mathematical Logic And Boolean Algebra", "Linear Programming", "Statics And Dynamics"];
    $scope.topics = ["set_relations_and_functions", "complex_numbers", "equation_and_inequalities", "sequences_and_series", "permutation_and_combinations", "binomial_theorm_and_mathematical_induction", "matrices_and_determinants", "trignometric_identities_equations", "inverse_trignometric_functions", "properties_of_triangle", "heights_and_distances", "rectangular_cartesian_coordinates", "straight_line_and_pair_of_straight_lines", "circle_and_system_of_circles", "conic_section", "limits_continuity_and_differentiability", "differentiation", "application_of_derivatives", "indefinite_integrals", "definite_integrals", "differential_equations", "vector_algebra", "3d_gemotry", "statistics", "probability", "mathematical_logic_and_Boolean_algebra", "linear_programming", "statics_and_dynamics"];
  }
  for(var x = 0; x < $scope.topics.length; x++){
    console.log($scope.topics[x]);
  }
  $scope.subject = $stateParams.subject;
});

app.controller('BookmarkListCtrl', function($scope, DbBookmarks, $stateParams, $rootScope, $location, $cordovaToast){
  $scope.bookmarks = [];
  DbBookmarks.getBookmarks($stateParams.topic).then(function(){
    if(!DbBookmarks.bookmarks.length){
      $cordovaToast.show('No bookmarks in ths category', 'long', 'center');
    }
    for(var x = 0; x < DbBookmarks.bookmarks.length; x++){
      if(DbBookmarks.bookmarks.item(x).question.length > 40){
        DbBookmarks.bookmarks.item(x).toShow = DbBookmarks.bookmarks.item(x).question.slice(0, 36) + "...";
      }
      else{
        DbBookmarks.bookmarks.item(x).toShow = DbBookmarks.bookmarks.item(x).question;
      }
      $scope.bookmarks.push(DbBookmarks.bookmarks.item(x));
    }
  });
  $scope.delete = function(question){
    DbBookmarks.deleteBookmark(question).then(function(){
      console.log("deleted : " + question);
    });
  };
  $scope.showQuestion = function(question){
    $rootScope.question = question;
    var strBuilder = [];
    for(var key in question){
          if (question.hasOwnProperty(key)) {
             strBuilder.push("Key is " + key + ", value is " + question[key] + "\n");
        }
    }
    console.log(strBuilder.join(""));
    var path = "/app/bookmarks/" + $stateParams.subject + "/" + $stateParams.topic + "/question";
    $location.path(path);
  };
});

app.controller('BookmarkQuestionCtrl', function($scope, DbBookmarks, $stateParams, $rootScope, $cordovaFileOpener2){
  $scope.question = $rootScope.question;
  $scope.openImg = function(link){
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
  var katStr = [];
  var katCount = 0;
  var limits = [];
  String.prototype.replaceBetween = function(start, end, what) {
    return this.substring(0, start) + what + this.substring(end);
  };
  for(var l = 0; l < $scope.question.question.length; l++){
    if($scope.question.question.charAt(l) == "`"){
      console.log("` detected`");
      var lower = l;
      var toConvert = "";
      ++l;
      while($scope.question.question.charAt(l) != "`"){
        toConvert += $scope.question.question.charAt(l);
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
      $scope.question.question = $scope.question.question.replaceBetween(limits[l][0], limits[l][1]+1, katStr[l]);
    }
  }
  document.getElementById("jax").innerHTML = $scope.question.question;
  if($scope.question.questionImage){
    window.plugins.Base64.encodeFile($scope.question.questionImage, function(base64){
      console.log('file base64 encoding done');
      $scope.currQImg =  base64;
    });
  }
  if($scope.question.AImg){
    window.plugins.Base64.encodeFile($scope.question.AImg, function(base64){
      //console.log('file base64 encoding: ' + base64);
      $scope.currAImg =  base64;
    });
  }
  if($scope.question.BImg){
    window.plugins.Base64.encodeFile($scope.question.BImg, function(base64){
      //console.log('file base64 encoding: ' + base64);
      $scope.currBImg =  base64;
    });
  }
  if($scope.question.CImg){
    window.plugins.Base64.encodeFile($scope.question.CImg, function(base64){
      //console.log('file base64 encoding: ' + base64);
      $scope.currCImg =  base64;
    });
  }
  if($scope.question.DImg){
    window.plugins.Base64.encodeFile($scope.question.DImg, function(base64){
      //console.log('file base64 encoding: ' + base64);
      $scope.currDImg =  base64;
    });
  }
});
