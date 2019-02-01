(function(angular) {
  "use strict";

  angular.module("jsql").service("EventEmitterService", EventEmitterService);

  /**
   * @ngInject
   */
  function EventEmitterService($rootScope) {
    /**TO HIDE $rootScope in one place inside angular service*/

    this.watch = watch;
    this.watchOnce = watchOnce;
    this.broadcast = broadcast;
    this.emit = emit;
    this.on = on;

    function watchOnce(item, callback) {
      if (!angular.isFunction(callback)) {
        console.error("EventEmitterService:watch -> No callback defined");
      } else {
        var listener = $rootScope.$watch(item, function(newVal) {
          callback(newVal);
          listener();
        });
      }
    }

    function watch(item, callback) {
      if (!angular.isFunction(callback)) {
        console.error("EventEmitterService:watch -> No callback defined");
      } else {
        $rootScope.$watch(item, callback);
      }
    }

    /**Callback has to be defined !!! */
    function on(event, callback, force) {
      if (!callback) {
        return console.error("EventEmitterService:on -> No callback defined");
      } else {
        $rootScope.$on(event, innerCallback);
      }

      function innerCallback(e, data) {
        // if (force) {
        //     /**Anyway call callback*/
        //     callback(data);
        // } else

        if (data) {
          /**Only if response contain any element*/
          if (angular.isArray(data) && data.length > 0) {
            callback(data);
          } else if (angular.isObject(data)) {
            callback(data);
          }
        } else {
          callback(null);
        }

        // }
      }
    }

    function emit(broadcastObject) {
      $rootScope.$emit(event, broadcastObject);
    }

    function broadcast(event, broadcastObject) {
      if (!broadcastObject) {
        broadcastObject = {};
      }

      $rootScope.$broadcast(event, broadcastObject);
    }

    this.namespace = {
      NOTIFICATION: "NOTIFICATION",
      APPLICATIONS: "APPLICATIONS",
      VISIT_PAGE: "VISIT_PAGE",
      USERS: "USERS",
      PROFILE: "PROFILE",
      AVATAR: "AVATAR",
      DELETE_APPLICATION: "DELETE_APPLICATION"
    };
  }
})(angular);
