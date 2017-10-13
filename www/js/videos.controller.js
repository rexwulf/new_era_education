var app = angular.module('videos.controller', ['db.service']);
var ip = "http://192.168.1.10:8080";
var resUrl = ip + "/Laravel/VGPT/resources/";
app.controller('VideosCtrl', function($scope){

});

app.controller('VideosDirCtrl', function($scope, $stateParams){
  if($stateParams.subject == "physics"){
    $scope.topicNames = ["Physics And Measurement", "Kinematics", "Laws Of Motion", "Work Energy and Power", "Rotational Motion", "Gravitation", "Properties Of Solid And Liquids", "Thermodynamics" , "Kinetic theory Of Gases", "oscillation And Waves", "Magnetic Effect of Current and Magnetism", "Electromagnetic Induction And Alternating Currents", "Electromagnetic Waves", "Optics", "Dual Nature Of Matter And Radiation", "Atoms And Nuclei", "Electronic Devices", "Communication Systems", "Modern Physics", "Electrostatics"];
    $scope.topics = ["physics_and_measurement", "kinematics", "laws_of_motion", "work_energy_and_power", "rotational_motion", "gravitation", "proprtie_of_solid_and_liquids", "thermodynamics" , "kinetic_theory_of_gases", "oscillation_and_waves", "magnetic_effect_of_current_and_magnetism", "electromagnetic_induction_and_alternating_currents", "electromagnetic_waves", "optics", "dual_nature_of_matter_and_radiation", "atoms_and_nuclei", "electrnic_devices", "communication_systems", "modern_physics", "electrostatics"];
  }
  if($stateParams.subject == "chemistry"){
    $scope.topicNames = ["Some Basics Concepts Of Chemistry", "States Of Matter", "Atomic Structure", "Chemical Bonding And Molecular Structure", "Chemical Thermodynamics", "The Solid State", "Solutions", "Electrochemistry", "Chemical Kinetics", "Surface Chemistry", "General Principle And Process Of Isolation Of Elements", "The P block Elements", "The D and F Block Elements", "Coordination Compounds", "Redox Reaction", "Hydrogen", "The S Block Elements", "The P Block Elements", "Organic Chemistry", "Hydrocarbons", "Environmental Chemistry"];
    $scope.topics = ["some_basic_concept_in_chemistry", "states_of_matter", "atomic_structure", "chemical_bonding_and_molecular_structure", "chemical_thermodynamics", "the_solid_state", "solutions", "electrochemistry", "chemical_kinetics", "surface_chemistry", "general_principles_and_process_of_isolation_of_elemnts", "the_p_block_elements", "the_d_and_f_block_elements", "coordination_compounds", "redox_reactions", "hydrogen", "the_s_block_elements", "the_p_block_elements", "organic_chemistry", "hydrocarbons", "environmental_chemistry"];
  }
  if($stateParams.subject == "maths"){
    $scope.topicNames = [ "Set Relation And Function", "Complex Numbers", "Equation And Inequalities", "Sequence And Series", "Permutation And Combinations", "Binomial Theorm And Mathematical induction", "Matrices And Determinants", "Trignometric Identities Equations", "Inverse Trignometric Functions", "Properties Of Triangle", "Height And Distances", "Rectangular Cartesian Coordinates", "Straight Line And Pair Of Straight Lines", "Circle And System Of Circles", "Conic Section", "Limits,Continuity And Differentiability", "Differentiation", "Application Of Derviatives", "Indefinite Integrals", "Definite Integrals", "Differential Equations", "Vector Algebra", "3D Geometry", "Statistics", "Probability", "Mathematical Logic And Boolean Algebra", "Linear Programming", "Statics And Dynamics"];
    $scope.topics = ["set_relations_and_functions", "complex_numbers", "equation_and_inequalities", "sequences_and_series", "permutation_and_combinations", "binomial_theorm_and_mathematical_induction", "matrices_and_determinants", "trignometric_identities_equations", "inverse_trignometric_functions", "properties_of_triangle", "heights_and_distances", "rectangular_cartesian_coordinates", "straight_line_and_pair_of_straight_lines", "circle_and_system_of_circles", "conic_section", "limits_continuity_and_differentiability", "differentiation", "application_of_derivatives", "indefinite_integrals", "definite_integrals", "differential_equations", "vector_algebra", "3d_gemotry", "statistics", "probability", "mathematical_logic_and_Boolean_algebra", "linear_programming", "statics_and_dynamics"];
  }
  $scope.subject = $stateParams.subject;
});

app.controller('VideosSubDirCtrl', function($timeout, $state, $scope, $stateParams, DbVideos, $cordovaFileOpener2, $cordovaFileTransfer, DbServiceSettings, $cordovaSQLite, $cordovaFile, $cordovaToast){
  //$scope.downloading = false;
  DbVideos.getVideosList($stateParams.subject, $stateParams.topic).then(function(){
    $scope.videos = [];
    var Video = function(video){
      for(var key in video){
        console.log(key);
      }
      this.downloading = false;
      this.title = video.title;
      this.description = video.description;
      this.intranetLink = video.intranetLink;
      this.internetLink = video.internetLink;
      console.log(video.deviceLink);
      this.deviceLink = video.deviceLink;
      this.open = function(){
        DbVideos.getVideo(this.title, $stateParams.subject).then(function(){
          this.deviceLink = DbVideos.link;
          var mime;
          if(this.deviceLink){
            mime = "video/" + this.deviceLink.split(".").pop();
          }
          else{
            mime = "mp4";
          }
          $cordovaFileOpener2.open(
            this.deviceLink,
            mime
          ).then(function() {
              console.log("file opened");
          }, function(err) {
              $cordovaToast.showShortBottom('Download video first');
              console.log(err);
              var strBuilder = [];
              for(var key in err){
                  if (err.hasOwnProperty(key)) {
                    strBuilder.push("Key is " + key + ", value is " + err[key] + "\n");
                  }
              }
              console.log(strBuilder.join(""));
          });
        });
      };
      if(video.deviceLink){
        /*this.open = function(){
          var mime = "video/" + video.deviceLink.split(".").pop();
          $cordovaFileOpener2.open(
            video.deviceLink,
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
        };*/
        this.delete = function(){
          $cordovaFile.removeFile(cordova.file.externalApplicationStorageDirectory, video.deviceLink.split("/").pop())
            .then(function (success) {
              console.log('removed video file');
              $cordovaToast.showShortBottom('Deleted video');
              DbVideos.removeVideo(video.id, $stateParams.subject);
            }, function (error) {
              console.log('error removing video file');
            });
        };
        this.download = function(){
          $cordovaToast.showShortBottom('Already downloaded');
        };
      }
      else{
        /*this.open = function(){
          $cordovaToast.showShortBottom('Download the video first');
        };*/
        this.delete = function(){
          $cordovaToast.showShortBottom('Video already deleted or never downloaded');
        };
        this.download = function(index){
          DbServiceSettings.getUserInfo().then(function(res){
            if(res[3] == "intranet"){
              console.log("intranet");
              var trustHosts = true;
              var options = {};
              var filename = video.intranetLink.split("/").pop();
              var targetPath = cordova.file.externalApplicationStorageDirectory + filename;
              $cordovaFileTransfer.download(resUrl + video.intranetLink, targetPath, options, trustHosts)
                .then(function(result) {
                  $scope.videos[index].downloading = false;
                  //$scope.downloading = false;
                  console.log("download complete from " + resUrl + video.intranetLink);
                  $cordovaToast.showShortBottom('Download Complete');
                  DbVideos.updateDeviceLink($stateParams.subject, targetPath, video.id);
                  /*this.open = function(){
                    var mime = "video/" + this.deviceLink.split(".").pop();
                    $cordovaFileOpener2.open(
                      this.deviceLink,
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
                  };*/
                  video.deviceLink = targetPath;
                  this.delete = function(){
                    $cordovaFile.removeFile(cordova.file.externalApplicationStorageDirectory, this.deviceLink.split("/").pop())
                      .then(function (success) {
                        console.log('removed video file');
                        DbVideos.removeVideo(DbVideos.videosList.item(x).id, $stateParams.subject);
                        video.deviceLink = targetPath;
                      }, function (error) {
                        console.log('error removing video file');
                      });
                  };
                }, function(err) {
                    console.log(err);
                }, function (progress) {
                  $scope.videos[index].downloading = true;
                  //$scope.downloading = true;
                  /*$timeout(function () {
                    console.log((progress.loaded / progress.total) * 100);
                  });*/
                });
            }
            else{
              console.log("internet");
              var trustHosts = true;
              var options = {};
              var filename = video.intranetLink.split("/").pop();
              var targetPath = cordova.file.externalApplicationStorageDirectory + filename;
              $cordovaFileTransfer.download(video.intranetLink, targetPath, options, trustHosts)
                .then(function(result) {
                  console.log("download complete from " + url);
                  DbVideos.updateDeviceLink($stateParams.subject, targetPath, video.id);
                  /*this.open = function(){
                    var mime = "video/" + this.deviceLink.split(".").pop();
                    $cordovaFileOpener2.open(
                      this.deviceLink,
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
                  };*/
                }, function(err) {
                    console.log(err);
                }, function (progress) {
                  $timeout(function () {
                    console.log((progress.loaded / progress.total) * 100);
                  });
                });
            }
          }, function(err){
            console.log(err);
          });
        };
      }
    };
    //var dateToday = new Date();
    //var dateToday = rawDate.getMonth() + "/" + rawDate.getDate() + "/" + rawDate.getFullYear();
    if(DbVideos.videosList.length >= 0){
      for(var x = 0; x < DbVideos.videosList.length; x++){
        /*if(DbVideos.videosList.item(x).downloadDate){
          var someDay = new Date(String(DbVideos.videosList.item(x).downloadDate));
          var timeDiff = Math.abs(dateToday.getTime() - someDay.getTime());
          var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
          if(diffDays >= 30){
            $cordovaFile.removeFile(cordova.file.externalApplicationStorageDirectory, DbVideos.videosList.item(x).deviceLink.split("/").pop())
              .then(function (success) {
                console.log('removed video file');
                DbVideos.removeVideo(DbVideos.videosList.item(x).id, $stateParams.subject);
              }, function (error) {
                console.log('error removing video file');
              });
          }
        }*/
        $scope.videos.push(new Video(DbVideos.videosList.item(x)));
      }
    }
    else{
      $cordovaToast
        .show('No videos in this category yet', 'long', 'center');
    }
    console.log("got videos");
  }, function(err){
    $scope.videos = [];
    console.log("error getting videos");
  });
});
