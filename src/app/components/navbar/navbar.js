(function (angular) {
    "use strict";

    angular.module("jsql").directive("jsqlNavbar", jsqlNavbar);

    /**
     * @ngInject
     */
    function jsqlNavbar() {
        return {
            restrict: "E",
            replace: true,
            templateUrl: "app/components/navbar/navbar.html",
            controllerAs: "vm",
            bindToController: true,
            controller: function (StorageService, EventEmitterService, UtilsService) {

                var vm = this;
                var vissibleSidebar = false;
                var sidebar = null;
                var footerSidebar = null;
                var sidebarWidth = null;
                var zeroWidth = "0px";
                var unsetWidth = "unset";

                vm.mostVisited =
                    StorageService.get(StorageService.namespace.LAST_PAGES) || [];

                init();

                function init() {

                    if (window.innerWidth > 768) {
                        vissibleSidebar = true;
                    }

                    EventEmitterService.on(
                        EventEmitterService.namespace.VISIT_PAGE,
                        function (pageData) {
                            vm.mostVisited.unshift({
                                name: pageData.name,
                                url: pageData.url
                            });

                            StorageService.set(
                                StorageService.namespace.LAST_PAGES,
                                vm.mostVisited
                            );
                        }
                    );

                    EventEmitterService.on(
                        EventEmitterService.namespace.DELETE_APPLICATION, clearLastVisited
                    )

                }

                function clearLastVisited() {

                    var url = vm.mostVisited[0].url;
                    vm.mostVisited = vm.mostVisited.filter(function (visited) {

                        if (visited.url !== url) {
                            return true;
                        }
                        return false;

                    });
                    localStorage.setItem("LAST_PAGES", JSON.stringify(vm.mostVisited));
                }

                vm.setVisibleSidebar = function () {

                    vissibleSidebar = !vissibleSidebar;
                    if (!sidebar || !footerSidebar) {
                        sidebar = document.getElementById("sidebar-custom");
                        footerSidebar = document.getElementById("footer-sidebar");
                        sidebarWidth = sidebar.style.minWidth;
                    }

                    if (sidebar.style.width !== zeroWidth) {
                        sidebar.style.minWidth = zeroWidth;
                        sidebar.style.width = zeroWidth;

                        footerSidebar.style.minWidth = zeroWidth;
                        footerSidebar.style.width = zeroWidth;
                    } else {
                        sidebar.style.minWidth = sidebarWidth;
                        sidebar.style.width = unsetWidth;

                        footerSidebar.style.minWidth = sidebarWidth;
                        footerSidebar.style.width = unsetWidth;
                    }

                };
            }
        };
    }
})(angular);
