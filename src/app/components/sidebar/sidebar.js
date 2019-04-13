(function (angular) {
    "use strict";

    angular.module("jsql").directive("jsqlSidebar", jsqlSidebar);

    /**
     * @ngInject
     */
    function jsqlSidebar() {
        return {
            restrict: "E",
            replace: true,
            templateUrl: "app/components/sidebar/sidebar.html",
            controllerAs: "vm",
            bindToController: true,
            controller: function (SERVER_URL, DictService, $timeout, $state, EventEmitterService, AuthService, $location) {
                var vm = this;

                vm.setActive = setActive;
                vm.setExpanded = setExpanded;
                vm.logout = logout;
                vm.toggle = toggle;

                vm.session = null;
                vm.applications = [];
                vm.plan = null;

                init();

                function init() {

                    getImage();
                    getSessionData();
                    getApplications();
                    getPlan();

                }

                function getImage() {
                    vm.avatar = SERVER_URL + '/api/avatar/' + AuthService.getToken();
                }

                function getApplications() {

                    DictService.applications().then(function (result) {
                        vm.applications = result;
                    });

                }

                function getSessionData() {
                    vm.session = AuthService.getSessionData();
                    vm.session.role = AuthService.beautifyRole(vm.session.role);

                }

                function getPlan() {
                    vm.plan = AuthService.getPlan();
                }

                function logout() {

                    AuthService.logout().then(function () {

                        AuthService.removeCookies();
                        AuthService.deleteSession();
                        window.localStorage.clear();
                        window.location.href = "/login/";

                    });

                }


                var expandedMenus = {};

                function setExpanded(menu) {

                    return expandedMenus[menu] ? "expanded" : "";

                }

                function toggle(menu) {

                    if (expandedMenus[menu]) {
                        expandedMenus[menu] = null;
                    } else {
                        expandedMenus[menu] = menu;
                    }

                }

                function setActive(path) {
                    return $location.path().substr(0, path.length) === path ? "active" : "";
                }

                EventEmitterService.on(
                    EventEmitterService.namespace.APPLICATIONS,
                    getApplications
                );

            }
        };
    }
})(angular);
