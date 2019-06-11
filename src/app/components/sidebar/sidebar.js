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
            controller: function ($rootScope, SERVER_URL, DictService, $timeout, $state, EventEmitterService, AuthService, $location, UtilsService) {
                var vm = this;

                vm.setActive = setActive;
                vm.setExpanded = setExpanded;
                vm.logout = logout;
                vm.toggle = toggle;

                vm.loading = true;
                vm.session = null;
                vm.applications = [];
                vm.plan = null;

                $rootScope.$on("$stateChangeStart", function () {
                    setStamp();
                });

                init();

                function init() {

                    setStamp();
                    getImage();
                    getSessionData().then(function(){
                        getApplications().then(function(){

                            if(AuthService.getRole() !== 'APP_DEV'){
                                getPlan();
                            }

                            vm.loading = false;
                        });
                    });

                }

                function setStamp(){
                    vm.stamp = UtilsService.getRandomFloor(50, 100);
                }

                function getImage() {
                    vm.avatar = SERVER_URL + '/api/avatar/' + AuthService.getToken()+'?t='+new Date().getTime();
                }

                function getApplications() {

                    return DictService.applications().then(function (result) {
                        vm.applications = result;
                    });

                }

                function getSessionData() {

                    return AuthService.refreshSession(function(){

                        vm.session = AuthService.getSessionData();
                        vm.session.role = AuthService.beautifyRole(vm.session.role);
                        vm.role =  AuthService.getRole();


                    });

                }

                function getPlan() {

                    AuthService.refreshPlan().then(function(){
                        vm.plan = AuthService.getPlan();
                    });

                }

                function logout() {

                    AuthService.logout().then(function () {

                        AuthService.deleteSession();
                        window.location.href = "/login";

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

                EventEmitterService.on(
                    EventEmitterService.namespace.SESSION,
                    getSessionData
                );

                EventEmitterService.on(
                    EventEmitterService.namespace.AVATAR,
                    getImage
                );

            }
        };
    }
})(angular);
