(function(angular) {
  "use strict";

  angular.module("jsql").factory("EndpointsFactory", EndpointsFactory);

  /**
   * @ngInject
   */
  function EndpointsFactory($http, ApiFactory, SERVER_URL, PORT) {
    return {
      login: login,
      plan: plan,
      logout: logout,
      register: register,
      applications: applications,
      generateApplication: generateApplication,
      deleteApplication: deleteApplication,
      stats: stats,
      profile: profile,
      members: members,
      admins: admins,
      forgotPassword: forgotPassword,
      reset: reset,
      activateAccount: activateAccount,
      reactivateAccount: reactivateAccount,
      deactivateAccount: deactivateAccount,
      addMember: addMember,
      deleteMember: deleteMember,
      getMemberApplications: getMemberApplications,
      addMemberToApplication: addMemberToApplication,
      deleteMemberWithApplication: deleteMemberWithApplication,
      demoteAdmin: demoteAdmin,
      addAdmin: addAdmin,
      getQueries: getQueries,
      getAllOptions: getAllOptions,
      getOptionsValues: getOptionsValues,
      updateUserDetails: updateUserDetails,
      changePassword: changePassword,
      updateOptions: updateOptions,
      updateQuery: updateQuery,
      getImage: getImage
    };

    function login(loginRequest) {
      return ApiFactory.post(SERVER_URL + PORT + "/api/login", loginRequest);
    }

    function plan() {
      return ApiFactory.get(SERVER_URL + PORT + "/api/plan");
    }

    function logout() {
      return ApiFactory.delete(SERVER_URL + PORT + "/api/logout");
    }

    function register(registerRequest) {
      return ApiFactory.post(
        SERVER_URL + PORT + "/api/register",
        registerRequest
      );
    }

    function forgotPassword(forgotPasswordRequest) {
      return ApiFactory.post(
        SERVER_URL + PORT + "/api/user/forgot-password",
        forgotPasswordRequest
      );
    }

    function reset(token, data) {
      return ApiFactory.post(
          SERVER_URL + PORT + "/api/user/reset-password/" + token,
          data
      );
    }

    function activateAccount(token) {
      return ApiFactory.get(SERVER_URL + PORT + "/api/user/activate/" + token);
    }

    function reactivateAccount(data) {
      return ApiFactory.post(SERVER_URL + PORT + "/api/user/activate", data);
    }

    function deactivateAccount() {
      return ApiFactory.delete(SERVER_URL + PORT + "/api/user");
    }

    function applications() {
      return ApiFactory.get(SERVER_URL + PORT + "/api/application");
    }

    function generateApplication(name) {
      return ApiFactory.post(SERVER_URL + PORT + "/api/application", name);
    }

    function deleteApplication(id) {
      return ApiFactory.patch(SERVER_URL + PORT + "/api/application/" + id);
    }

    function stats(dateFrom, dateTo, data) {
      return ApiFactory.post(SERVER_URL + PORT + "/api/builds/" + dateFrom + '/' + dateTo, data);
    }

    function profile() {
      return ApiFactory.get(SERVER_URL + PORT + "/api/user");
    }

    function members() {
      return ApiFactory.get(SERVER_URL + PORT + "/api/app-dev");
    }

    function admins() {
      return ApiFactory.get(SERVER_URL + PORT + "/api/app-admin");
    }

    function addMember(memberRequest) {
      return ApiFactory.post(SERVER_URL + PORT + "/api/app-dev", memberRequest);
    }

    function deleteMember(id) {
      return ApiFactory.delete(SERVER_URL + PORT + "/api/app-dev/" + id);
    }

    function getMemberApplications(id) {
      return ApiFactory.get(
        SERVER_URL + PORT + "/api/app-dev/application/" + id
      );
    }

    function addMemberToApplication(data) {
      return ApiFactory.post(
        SERVER_URL + PORT + "/api/app-dev/application",
        data
      );
    }

    function deleteMemberWithApplication(data) {
      return ApiFactory.post(SERVER_URL + PORT + "/api/app-dev/application/unassign", data);
    }

    function addAdmin(data) {
      return ApiFactory.post(SERVER_URL + PORT + "/api/app-admin", data);
    }

    function demoteAdmin(id) {
      return ApiFactory.patch(SERVER_URL + PORT + "/api/app-admin", id);
    }

    function getQueries(dateFrom, dateTo, data) {
      return ApiFactory.post(SERVER_URL + PORT + "/api/queries/" + dateFrom + "/" + dateTo, data);
    }

    function getAllOptions(id) {
      return ApiFactory.get(
        SERVER_URL + PORT + "/api/options/" + id
      );
    }

    function getOptionsValues() {
      return ApiFactory.get(SERVER_URL + PORT + "/api/options/values");
    }

    function updateUserDetails(id, data) {
      return ApiFactory.patch(SERVER_URL + PORT + "/api/user/" + id, data);
    }

    function changePassword(data) {
      return ApiFactory.post(SERVER_URL + PORT + "/api/user/change-password", data);
    }

    function updateOptions(id, options) {
      return ApiFactory.patch(
        SERVER_URL + PORT + "/api/options/" + id,
        options
      );
    }

    function updateQuery(id, request) {
      return ApiFactory.patch(SERVER_URL + PORT + "/api/request/query/" + id, request);
    }

    function getImage() {
      return ApiFactory.get(SERVER_URL + PORT + "/api/avatar");
    }
  }
})(angular);
