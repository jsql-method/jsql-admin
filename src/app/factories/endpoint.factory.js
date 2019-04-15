(function (angular) {
    "use strict";

    angular.module("jsql").factory("EndpointsFactory", EndpointsFactory);

    /**
     * @ngInject
     */
    function EndpointsFactory($http, ApiFactory, SERVER_URL) {
        return {
            login: login,
            session: session,
            plan: plan,
            logout: logout,
            register: register,
            applications: applications,
            application: application,
            createApplication: createApplication,
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
            getOptions: getOptions,
            getOptionsValues: getOptionsValues,
            updateUserDetails: updateUserDetails,
            changePassword: changePassword,
            updateOptions: updateOptions,
            updateQuery: updateQuery,
            getImage: getImage,
            toggleProduction: toggleProduction
        };

        function login(loginRequest) {
            return ApiFactory.post(SERVER_URL + "/api/login", loginRequest);
        }

        function session(){
            return ApiFactory.get(SERVER_URL + "/api/session");
        }

        function plan() {
            return ApiFactory.get(SERVER_URL + "/api/plan");
        }

        function logout() {
            return ApiFactory.delete(SERVER_URL + "/api/logout");
        }

        function register(registerRequest) {
            return ApiFactory.post(
                SERVER_URL + "/api/register",
                registerRequest
            );
        }

        function forgotPassword(forgotPasswordRequest) {
            return ApiFactory.post(
                SERVER_URL + "/api/user/forgot-password",
                forgotPasswordRequest
            );
        }

        function reset(token, data) {
            return ApiFactory.post(
                SERVER_URL + "/api/user/reset-password/" + token,
                data
            );
        }

        function activateAccount(token) {
            return ApiFactory.get(SERVER_URL + "/api/user/activate/" + token);
        }

        function reactivateAccount(data) {
            return ApiFactory.post(SERVER_URL + "/api/user/activate", data);
        }

        function deactivateAccount() {
            return ApiFactory.delete(SERVER_URL + "/api/user");
        }

        function application(id){
            return ApiFactory.get(SERVER_URL + "/api/application/"+id);
        }

        function applications() {
            return ApiFactory.get(SERVER_URL + "/api/application");
        }

        function createApplication(data) {
            return ApiFactory.post(SERVER_URL + "/api/application", data);
        }

        function deleteApplication(id) {
            return ApiFactory.patch(SERVER_URL + "/api/application/" + id);
        }

        function stats(dateFrom, dateTo, data) {
            return ApiFactory.post(SERVER_URL + "/api/builds/" + dateFrom + '/' + dateTo, data);
        }

        function profile() {
            return ApiFactory.get(SERVER_URL + "/api/user");
        }

        function members() {
            return ApiFactory.get(SERVER_URL + "/api/app-dev");
        }

        function admins() {
            return ApiFactory.get(SERVER_URL + "/api/app-admin");
        }

        function addMember(memberRequest) {
            return ApiFactory.post(SERVER_URL + "/api/app-dev", memberRequest);
        }

        function deleteMember(id) {
            return ApiFactory.delete(SERVER_URL + "/api/app-dev/" + id);
        }

        function getMemberApplications(id) {
            return ApiFactory.get(
                SERVER_URL + "/api/app-dev/application/" + id
            );
        }

        function addMemberToApplication(data) {
            return ApiFactory.post(
                SERVER_URL + "/api/app-dev/application",
                data
            );
        }

        function deleteMemberWithApplication(data) {
            return ApiFactory.post(SERVER_URL + "/api/app-dev/application/unassign", data);
        }

        function addAdmin(data) {
            return ApiFactory.post(SERVER_URL + "/api/app-admin", data);
        }

        function demoteAdmin(id) {
            return ApiFactory.patch(SERVER_URL + "/api/app-admin", id);
        }

        function getQueries(dateFrom, dateTo, data) {
            return ApiFactory.post(SERVER_URL + "/api/queries/" + dateFrom + "/" + dateTo, data);
        }

        function getAllOptions(id) {
            return ApiFactory.get(
                SERVER_URL + "/api/options/" + id
            );
        }

        function getOptions(id) {
            return ApiFactory.get(SERVER_URL + "/api/options/"+id);
        }

        function getOptionsValues() {
            return ApiFactory.get(SERVER_URL + "/api/options/values");
        }

        function updateUserDetails(data) {
            return ApiFactory.patch(SERVER_URL + "/api/user/", data);
        }

        function changePassword(data) {
            return ApiFactory.post(SERVER_URL + "/api/user/change-password", data);
        }

        function updateOptions(id, options) {
            return ApiFactory.patch(
                SERVER_URL + "/api/options/" + id,
                options
            );
        }

        function toggleProduction(id, data){
            return ApiFactory.patch(SERVER_URL + "/api/options/toggle-production/" + id, data);
        }

        function updateQuery(id, request) {
            return ApiFactory.patch(SERVER_URL + "/api/request/query/" + id, request);
        }

        function getImage() {
            return ApiFactory.get(SERVER_URL + "/api/avatar");
        }

    }
})(angular);
