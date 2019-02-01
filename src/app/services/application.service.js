(function(angular) {
  "use strict";

  angular.module("jsql").service("ApplicationService", ApplicationService);

  /**
   * @ngInject
   */
  function ApplicationService(EndpointsFactory) {
    var provider = {};

    /**
     * Funkcja dodaje membera
     */

    provider.generateApplication = function(data) {
      return EndpointsFactory.generateApplication(data).$promise;
    };

    provider.deleteApplication = function(id) {
      return EndpointsFactory.deleteApplication(id).$promise;
    };

    provider.getQueries = function(dateFrom, dateTo, data) {
      return EndpointsFactory.getQueries(dateFrom, dateTo, data).$promise;
    };

    provider.getAllOptions = function(apiKey) {
      return EndpointsFactory.getAllOptions(apiKey).$promise;
    };

    provider.getOptionsValues = function() {
      return EndpointsFactory.getOptionsValues().$promise;
    };

    provider.updateOptions = function(id, data) {
      return EndpointsFactory.updateOptions(id, data).$promise;
    };

    provider.updateQuery = function(id, data) {
      return EndpointsFactory.updateQuery(id, data).$promise;
    };

    return provider;
  }
})(angular);
