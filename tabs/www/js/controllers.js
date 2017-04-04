angular.module('starter.controllers', ['ngCordova'])

.controller("DashCtrl",['$scope', '$rootScope', '$ionicPlatform', '$cordovaBeacon',
  function($scope, $rootScope, $ionicPlatform, $cordovaBeacon){
      $ionicPlatform.ready(function() {
        var permissions = cordova.plugins.permissions;
        var list = [
          permissions.BLUETOOTH_PRIVILEGED,
          permissions.BLUETOOTH_ADMIN,
          permissions.BLUETOOTH,
          permissions.ACCESS_COARSE_LOCATION
        ];
        console.log("checkPermission");
        permissions.checkPermission(permissions.ACCESS_COARSE_LOCATION, function (status ){
          console.log(status);
          if(!status.hasPermission ){
            console.log("requestPermissions");
            permissions.requestPermissions(list,function (status) {
              if(!status.hasPermission ){
                console.log(status);
              }
              else{}
              findBle();
            },function (error) {
              console.log(error);
            })
          }
          else{
            findBle();
          }
        },function (error) {
          console.log(error)
        });

       });

    function findBle(){
      console.log("OK");
      $scope.beacons = {};

      $cordovaBeacon.isBluetoothEnabled()
        .then(function(isEnabled) {
          console.log("isEnabled: " + isEnabled);
          if (!isEnabled) {
            $cordovaBeacon.enableBluetooth();
            console.log("enable Bluetooth");
          }
        });

      $cordovaBeacon.startRangingBeaconsInRegion($cordovaBeacon.createBeaconRegion("estimote", "b9407f30-f5f8-466e-aff9-25556b57fe6d"));

      $rootScope.$on("$cordovaBeacon:didRangeBeaconsInRegion", function(event, pluginResult) {
        var uniqueBeaconKey;
        for(var i = 0; i < pluginResult.beacons.length; i++) {
          uniqueBeaconKey = pluginResult.beacons[i].uuid + ":" + pluginResult.beacons[i].major + ":" + pluginResult.beacons[i].minor;
          $scope.beacons[uniqueBeaconKey] = pluginResult.beacons[i];
        }
        console.log(uniqueBeaconKey);
        $scope.$apply();
      });

      $rootScope.$on('$cordovaBeacon:didStartMonitoringForRegion', function(event, pluginResult) {
        console.log("didStartMonitoringForRegion");
        console.log(event);
        console.log(pluginResult);
      });
    }

    /**
     * Function that creates a BeaconRegion data transfer object.
     *
     * @throws Error if the BeaconRegion parameters are not valid.
     */

  }])

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
