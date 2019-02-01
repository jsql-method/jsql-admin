(function(angular) {
  "use strict";

  angular.module("jsql").service("MemberService", MemberService);

  /**
   * @ngInject
   */
  function MemberService(EndpointsFactory) {
    var provider = {};

    /**
     * Funkcja dodaje membera
     */

    provider.addMember = function(member) {
      return EndpointsFactory.addMember(member).$promise;
    };

    provider.deleteMember = function(id) {
      return EndpointsFactory.deleteMember(id).$promise;
    };

    provider.getMemberApplications = function(email) {
      return EndpointsFactory.getMemberApplications(email).$promise;
    };

    provider.addMemberToApplication = function(data) {
      return EndpointsFactory.addMemberToApplication(data).$promise;
    };

    provider.deleteMemberWithApplication = function(data) {
      return EndpointsFactory.deleteMemberWithApplication(data).$promise;
    };

    return provider;
  }
})(angular);
