angular.module('starter.controllers', ['db.service'])

.controller('AppCtrl', function($scope, $ionicModal, DbServiceSettings, $cordovaDevice, $cordovaSQLite, $ionicPopover, $timeout) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  //
  //
  //BEGIN rishab's code
  //
  //
  // Form data for the login modal
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };
    //
    //
    //End rishab's code
    //
    //
  //switch between intranet and internet
  $scope.saveSettings = function(intranet){
    if(intranet){
      DbServiceSettings.changeAccess("intranet").then(function(data){
        console.log("intranet");
      }, function(error){
        for(var e in error)
          console.log(error[e]);
        console.log("error");
      });
    }
    else{
      DbServiceSettings.changeAccess("internet").then(function(data){
        console.log("internet");
      }, function(error){
        for(var e in error)
          console.log(error[e]);
        console.log("error");
      });
    }
  };

  //prepare the permanent settings view model
  $ionicModal.fromTemplateUrl('templates/permanentSettings.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  //fx for closing model
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  //check for correct password and display the permanent settings pane
  $scope.enterPermanentSettings = function(password){
    if(password == "nakul"){
      $scope.modal.show();
    }
  };
  $scope.save = function(firstname, lastname, admnNo, batch){
    var db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var uuid = $cordovaDevice.getUUID();
    var query = "INSERT INTO user (firstname, lastname, admnNo, deviceId, batch, accessMethod) VALUES (?, ?, ?, ?, ?, ?)";
    $cordovaSQLite.execute(db, query, [firstname, lastname, admnNo, uuid, batch, "intranet"]).then(function(result){
      console.log("insert id = " + result.insertId);
    }, function(err){
      console.log(err.message);
    });
    console.log("uuid = " + uuid);
    var physicsTopics = ["physics_and_measurement", "kinematics", "laws_of_motion", "work_energy_and_power", "rotational_motion", "gravitation", "proprtie_of_solid_and_liquids", "thermodynamics" , "kinetic_theory_of_gases", "oscillation_and_waves", "magnetic_effect_of_current_and_magnetism", "electromagnetic_induction_and_alternating_currents", "electromagnetic_waves", "optics", "dual_nature_of_matter_and_radiation", "atoms_and_nuclei", "electrnic_devices", "communication_systems", "modern_physics", "electrostatics"];
    var chemistryTopics = ["some_basic_concept_in_chemistry", "states_of_matter", "atomic_structure", "chemical_bonding_and_molecular_structure", "chemical_thermodynamics", "the_solid_state", "solutions", "electrochemistry", "chemical_kinetics", "surface_chemistry", "general_principles_and_process_of_isolation_of_elemnts", "the_p_block_elements", "the_d_and_f_block_elements", "coordination_compounds", "redox_reactions", "hydrogen", "the_s_block_elements", "the_p_block_elements", "organic_chemistry", "hydrocarbons", "environmental_chemistry"];
    var mathsTopics = ["set_relations_and_functions", "complex_numbers", "equation_and_inequalities", "sequences_and_series", "permutation_and_combinations", "binomial_theorm_and_mathematical_induction", "matrices_and_determinants", "trignometric_identities_equations", "inverse_trignometric_functions", "properties_of_triangle", "heights_and_distances", "rectangular_cartesian_coordinates", "straight_line_and_pair_of_straight_lines", "circle_and_system_of_circles", "conic_section", "limits_continuity_and_differentiability", "differentiation", "application_of_derivatives", "indefinite_integrals", "definite_integrals", "differential_equations", "vector_algebra", "3d_gemotry", "statistics", "probability", "mathematical_logic_and_Boolean_algebra", "linear_programming", "statics_and_dynamics"];
    for(var x = 0; x < physicsTopics.length; x++){
      query = "INSERT INTO qaLevels (subject, chapter, topic, level) VALUES (?, ?, ?, ?)";
      $cordovaSQLite.execute(db, query, ["physics", physicsTopics[x], physicsTopics[x], 0]).then(function(res){
        console.log("level 0 " + physicsTopics[x]);
      }, function(err){
        console.log(err.message);
      });
    }
    for(x = 0; x < chemistryTopics.length; x++){
      query = "INSERT INTO qaLevels (subject, chapter, topic, level) VALUES (?, ?, ?, ?)";
      $cordovaSQLite.execute(db, query, ["chemistry", chemistryTopics[x], chemistryTopics[x], 0]).then(function(res){
        console.log("level 0 " + chemistryTopics[x]);
      }, function(err){
        console.log(err.message);
      });
    }
    for(x = 0; x < mathsTopics.length; x++){
      query = "INSERT INTO qaLevels (subject, chapter, topic, level) VALUES (?, ?, ?, ?)";
      $cordovaSQLite.execute(db, query, ["maths", mathsTopics[x], mathsTopics[x], 0]).then(function(res){
        console.log("level 0 " + mathsTopics[x]);
      }, function(err){
        console.log(err.message);
      });
    }
    //Code for sample data
    query = "INSERT INTO qaLevels (subject, chapter, topic, level) VALUES (?, ?, ?, ?)";
    $cordovaSQLite.execute(db, query, ["physics", "modern_physics", "modern_physics", 0]).then(function(result){
      console.log("inserted modern_physics lvl 0");
    }, function(err){
      var strBuilder = [];
      for(var key in err){
            if (err.hasOwnProperty(key)) {
               strBuilder.push("Key is " + key + ", value is " + err[key] + "\n");
          }
      }
      console.log(strBuilder.join(""));
    });
    $cordovaSQLite.execute(db, query, ["physics", "mechanics", "mechanics", 0]).then(function(result){
      console.log("inserted mechanics lvl 0");
      console.log("insert id = " + result.insertId);
    }, function(err){
      var strBuilder = [];
      for(var key in err){
            if (err.hasOwnProperty(key)) {
               strBuilder.push("Key is " + key + ", value is " + err[key] + "\n");
          }
      }
      console.log(strBuilder.join(""));
    });
    //end code for sdample data
    $scope.closeModal();
  };
  $scope.reset = function(){
    console.log("reset");
  };

  //this is for dev only
  $scope.delDB = function(){
    $cordovaSQLite.deleteDB({name: 'my.db', location: 'default'});
  };
});
