(function(angular) {
  "use strict";

  angular.module("jsql").service("DictService", DictService);

  /**
   * @ngInject
   */
  function DictService(EndpointsFactory, $q) {
    var dict = {};

    dict.data = {
      profile: null,
      applications: null,
      members: null,
      admins: null
    };

    dict.plan = {};

    dict.refresh = function(endpoint) {
      dict.data[endpoint] = { result: null, promise: null, loading: true };

      dict[endpoint] = function() {
        if (dict.data[endpoint].result) {
          var deferred = $q.defer();
          deferred.resolve(dict.data[endpoint].result);

          return deferred.promise;
        }

        if (dict.data[endpoint].loading && dict.data[endpoint].promise) {
          console.warn("still loading...");

          return dict.data[endpoint].promise;
        }

        dict.data[endpoint].promise = EndpointsFactory[endpoint]()
          .$promise.then(function(result) {
            dict.data[endpoint].result = result.data.data;
            dict.data[endpoint].loading = false;
            return result.data.data;
          })
          .catch(function(err) {
            console.log(err);
            return err;
          });

        return dict.data[endpoint].promise;
      };
    };

    dict.load = function() {
      angular.forEach(dict.data, function(index, endpoint) {
        dict.refresh(endpoint);
      });
    };

    dict.getUserPlan = function() {
      let userplan = {
        name: window.localStorage.getItem("_mPlan"),
        maxUsers: unHashUserPlan(window.localStorage.getItem("_mUsers")),
        maxApps: unHashUserPlan(window.localStorage.getItem("_mApps"))
      };

      function unHashUserPlan(value) {
        return parseInt(value.substring(2, value.length - 2));
      }

      return userplan;
    };

    return dict;
  }
})(angular);
