var app = angular.module('dpp.controller', ['db.service', 'dpp.service']);
app.controller('dppTopicCtrl', function($scope, $stateParams, DppService){
  if($stateParams.subject == "physics"){
    $scope.topicNames = ["Physics And Measurement", "Kinematics", "Laws Of Motion", "Work Energy and Power", "Rotational Motion", "Gravitation", "Properties Of Solid And Liquids", "Thermodynamics" , "Kinetic theory Of Gases", "oscillation And Waves", "Magnetic Effect of Current and Magnetism", "Electromagnetic Induction And Alternating Currents", "Electromagnetic Waves", "Optics", "Dual Nature Of Matter And Radiation", "Atoms And Nuclei", "Electronic Devices", "Communication Systems", "Modern Physics", "Electrostatics"];
    $scope.topics = ["physics_and_measurement", "kinematics", "laws_of_motion", "work_energy_and_power", "rotational_motion", "gravitation", "proprtie_of_solid_and_liquids", "thermodynamics" , "kinetic_theory_of_gases", "oscillation_and_waves", "magnetic_effect_of_current_and_magnetism", "electromagnetic_induction_and_alternating_currents", "electromagnetic_waves", "optics", "dual_nature_of_matter_and_radiation", "atoms_and_nuclei", "electrnic_devices", "communication_systems", "modern_physics", "electrostatics"];
  }
  else if($stateParams.subject == "chemistry"){
    $scope.topicNames = ["Some Basics Concepts Of Chemistry", "States Of Matter", "Atomic Structure", "Chemical Bonding And Molecular Structure", "Chemical Thermodynamics", "The Solid State", "Solutions", "Electrochemistry", "Chemical Kinetics", "Surface Chemistry", "General Principle And Process Of Isolation Of Elements", "The P block Elements", "The D and F Block Elements", "Coordination Compounds", "Redox Reaction", "Hydrogen", "The S Block Elements", "The P Block Elements", "Organic Chemistry", "Hydrocarbons", "Environmental Chemistry"];
    $scope.topics = ["some_basic_concept_in_chemistry", "states_of_matter", "atomic_structure", "chemical_bonding_and_molecular_structure", "chemical_thermodynamics", "the_solid_state", "solutions", "electrochemistry", "chemical_kinetics", "surface_chemistry", "general_principles_and_process_of_isolation_of_elemnts", "the_p_block_elements", "the_d_and_f_block_elements", "coordination_compounds", "redox_reactions", "hydrogen", "the_s_block_elements", "the_p_block_elements", "organic_chemistry", "hydrocarbons", "environmental_chemistry"];
  }
  else if($stateParams.subject == "maths"){
    $scope.topicNames = [ "Set Relation And Function", "Complex Numbers", "Equation And Inequalities", "Sequence And Series", "Permutation And Combunations", "Binomial Theorm And Mathematical induction", "Matrices And Determinants", "Trignometric Identities Equations", "Inverse Trignometric Functions", "Properties Of Triangle", "Height And Distances", "Rectangular Cartesian Coordinates", "Straight Line And Pair Of Straight Lines", "Circle And System Of Circles", "Conic Section", "Limits,Continuity And Differentiability", "Differentiation", "Application Of Derviatives", "Indefinite Integrals", "Definite Integrals", "Differential Equations", "Vector Algebra", "3D Geometry", "Statistics", "Probability", "Mathematical Logic And Boolean Algebra", "Linear Programming", "Statics And Dynamics"];
    $scope.topics = ["set_relations_and_functions", "complex_numbers", "equation_and_inequalities", "sequences_and_series", "permutation_and_combinations", "binomial_theorm_and_mathematical_induction", "matrices_and_determinants", "trignometric_identities_equations", "inverse_trignometric_functions", "properties_of_triangle", "heights_and_distances", "rectangular_cartesian_coordinates", "straight_line_and_pair_of_straight_lines", "circle_and_system_of_circles", "conic_section", "limits_continuity_and_differentiability", "differentiation", "application_of_derivatives", "indefinite_integrals", "definite_integrals", "differential_equations", "vector_algebra", "3d_gemotry", "statistics", "probability", "mathematical_logic_and_Boolean_algebra", "linear_programming", "statics_and_dynamics"];
  }
  $scope.addDpp = function(){
    DppService.addDpp().then(function(res){
      console.log("added all dpp");
    });
  };
  $scope.subject = $stateParams.subject;
});
app.controller('dppListCtrl', function($scope, $stateParams, DbDpp, $cordovaFileOpener2){
  DbDpp.getDppList($stateParams.subject, $stateParams.topic).then(function(res){
    var Dpp = function(dpp){
      this.title = dpp.title;
      this.description = dpp.description;
      var  mime = "";
      if(dpp.fileType == "pdf"){
        mime = "application/pdf";
      }
      else{
        mime = "image/"+dpp.fileType;
      }
      this.open = function(){
        $cordovaFileOpener2.open(
          dpp.deviceLink,
          mime
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
    };
    $scope.dpps = [];
    if(res.length >= 0){
      for(var x = 0; x < res.length; x++){
        $scope.dpps.push(new Dpp(res.item(x)));
      }
    }
    else{
      $cordovaToast
        .show('No Dpps in this category yet', 'long', 'center');
    }
  });
});
