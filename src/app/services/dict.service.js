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
      developers: null,
      admins: null
    };

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
            dict.data[endpoint].result = result.data;
            dict.data[endpoint].loading = false;
            return result.data;
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

    return dict;
  }
})(angular);
