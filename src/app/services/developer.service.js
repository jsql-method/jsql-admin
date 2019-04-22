(function(angular) {
  "use strict";

  angular.module("jsql").service("DeveloperService", DeveloperService);

  /**
   * @ngInject
   */
  function DeveloperService(EndpointsFactory) {
    var provider = {};

    /**
     * Funkcja dodaje developera
     */

    provider.addDeveloper = function(developer) {
      return EndpointsFactory.addDeveloper(developer).$promise;
    };

    provider.deleteDeveloper = function(id) {
      return EndpointsFactory.deleteDeveloper(id).$promise;
    };

    provider.getDeveloperApplications = function(email) {
      return EndpointsFactory.getDeveloperApplications(email).$promise;
    };

    provider.addDeveloperToApplication = function(data) {
      return EndpointsFactory.addDeveloperToApplication(data).$promise;
    };

    provider.deleteDeveloperWithApplication = function(data) {
      return EndpointsFactory.deleteDeveloperWithApplication(data).$promise;
    };

    return provider;
  }
})(angular);
