(function(angular) {
  "use strict";

  angular.module("jsql").service("AdminService", AdminService);

  /**
   * @ngInject
   */
  function AdminService(EndpointsFactory) {
    var provider = {};

    /**
     * Funkcja dodaje membera
     */

    provider.addAdmin = function(data) {
      return EndpointsFactory.addAdmin(data).$promise;
    };

    provider.demoteAdmin = function(data) {
      return EndpointsFactory.demoteAdmin(data).$promise;
    };

    return provider;
  }
})(angular);
