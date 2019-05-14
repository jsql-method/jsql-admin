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
            queries: queries,
            profile: profile,
            developers: developers,
            admins: admins,
            forgotPassword: forgotPassword,
            reset: reset,
            activateAccount: activateAccount,
            reactivateAccount: reactivateAccount,
            deactivateAccount: deactivateAccount,
            addDeveloper: addDeveloper,
            deleteDeveloper: deleteDeveloper,
            deleteAdmin: deleteAdmin,
            getDeveloperApplications: getDeveloperApplications,
            addDeveloperToApplication: addDeveloperToApplication,
            deleteDeveloperWithApplication: deleteDeveloperWithApplication,
            demoteAdmin: demoteAdmin,
            advanceDeveloper: advanceDeveloper,
            addAdmin: addAdmin,
            builds: builds,
            requests: requests,
            getAllOptions: getAllOptions,
            getOptions: getOptions,
            getOptionsValues: getOptionsValues,
            updateUserDetails: updateUserDetails,
            changePassword: changePassword,
            updateOptions: updateOptions,
            updateQuery: updateQuery,
            getImage: getImage,
            toggleProduction: toggleProduction,
            buildsChart: buildsChart,
            requestsChart: requestsChart,
            queriesChart: queriesChart,
            feedback: feedback,
            verify: verify,
            getPabblyAccess: getPabblyAccess
        };

        function getPabblyAccess(){
            return ApiFactory.get(SERVER_URL + "/api/user/pabbly-session");
        }

        function verify(token){
            return ApiFactory.post(SERVER_URL + "/api/payment/verify/" + token);
        }

        function feedback(token, data){
            return ApiFactory.post(
                SERVER_URL + "/api/user/feedback/" + token,
                data
            );
        }

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

        function builds(page, data) {
            return ApiFactory.post(SERVER_URL + "/api/stats/builds/", data, { page: page });
        }

        function buildsChart(data) {
            return ApiFactory.post(SERVER_URL + "/api/stats/chart/builds/", data);
        }

        function requestsChart(data) {
            return ApiFactory.post(SERVER_URL + "/api/stats/chart/requests/", data);
        }

        function queriesChart(data) {
            return ApiFactory.post(SERVER_URL + "/api/stats/chart/queries/", data);
        }

        function requests(page, data) {
            return ApiFactory.post(SERVER_URL + "/api/stats/requests/", data, { page: page });
        }

        function queries(page, data) {
            return ApiFactory.post(SERVER_URL + "/api/stats/queries/", data, { page: page });
        }

        function profile() {
            return ApiFactory.get(SERVER_URL + "/api/user");
        }

        function developers() {
            return ApiFactory.get(SERVER_URL + "/api/app-dev");
        }

        function admins() {
            return ApiFactory.get(SERVER_URL + "/api/app-admin");
        }

        function addDeveloper(developerRequest) {
            return ApiFactory.post(SERVER_URL + "/api/app-dev", developerRequest);
        }

        function deleteDeveloper(id) {
            return ApiFactory.delete(SERVER_URL + "/api/app-dev/" + id);
        }

        function deleteAdmin(id){
            return ApiFactory.delete(SERVER_URL + "/api/app-admin/" + id);
        }

        function getDeveloperApplications(id) {
            return ApiFactory.get(
                SERVER_URL + "/api/app-dev/application/" + id
            );
        }

        function addDeveloperToApplication(data) {
            return ApiFactory.post(
                SERVER_URL + "/api/app-dev/application",
                data
            );
        }

        function deleteDeveloperWithApplication(data) {
            return ApiFactory.post(SERVER_URL + "/api/app-dev/application/unassign", data);
        }

        function addAdmin(data) {
            return ApiFactory.post(SERVER_URL + "/api/app-admin", data);
        }

        function advanceDeveloper(id) {
            return ApiFactory.patch(SERVER_URL + "/api/app-dev", id);
        }

        function demoteAdmin(id) {
            return ApiFactory.patch(SERVER_URL + "/api/app-admin", id);
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
            return ApiFactory.patch(SERVER_URL + "/api/query/query/" + id, request);
        }

        function getImage() {
            return ApiFactory.get(SERVER_URL + "/api/avatar");
        }

    }
})(angular);
