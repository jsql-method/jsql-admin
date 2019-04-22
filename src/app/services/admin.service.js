(function(angular) {
  "use strict";

  angular.module("jsql").service("AdminService", AdminService);

  /**
   * @ngInject
   */
  function AdminService(EndpointsFactory) {
    var provider = {};

    /**
     * Funkcja dodaje developera
     */

    provider.addAdmin = function(data) {
      return EndpointsFactory.addAdmin(data).$promise;
    };

    provider.demoteAdmin = function(data) {
      return EndpointsFactory.demoteAdmin(data).$promise;
    };

      provider.deleteAdmin = function(data) {
          return EndpointsFactory.deleteAdmin(data).$promise;
      };

    return provider;
  }
})(angular);
