(function(angular) {
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
      controller: function(DictService, $timeout, $state, EventEmitterService, AuthService, $location) {
        var vm = this;

        vm.setActive = setActive;
        vm.setExpanded = setExpanded;
        vm.logout = logout;
        vm.toggle = toggle;
        vm.expandProperMenu = expandProperMenu;

        vm.currentRoute = $state.current.name;

        vm.profile = {
          fullName: "",
          role: "",
          company: "",
          avatarStyle: ""
        };

        vm.applications = [];
        vm.plan = null;
        vm.admins = -1;
        vm.members = -1;
        vm.image = "";

        init();

        function init() {

          getImage();
          getProfile();
          getApplications();
          getUserPlan();
          getMembersAndAdmins();

        }

        function getImage() {

          AuthService.getImage()
              .then(function (result) {
                vm.profile.avatarStyle = 'data:image/jpeg;base64,' + result.data;
              })

        }

        function getApplications() {

          DictService.applications().then(function(result) {

            vm.applications = result;

          });

        }

        function getProfile() {

          DictService.profile().then(function(profile) {

            vm.profile.fullName = profile.firstName + " " + profile.lastName;
            vm.profile.company = profile.company;

          });

          vm.profile.role = localStorage.getItem('_mRole');
          vm.profile.company = localStorage.getItem('_mCompany');

        }

        function getMembersAndAdmins() {

          DictService.admins().then(function(result) {

            if (result) {
              vm.admins = result.length;
            }

          });

          DictService.members().then(function(result) {

            if (result) {
              vm.members = result.length;
            }

          });

        }

        function logout() {

          AuthService.logout().then(function() {

            AuthService.deleteSession();
            window.localStorage.clear();
            window.location.href = "/auth/login/";

          });

        }

        function getUserPlan() {

          vm.plan = DictService.getUserPlan();

        }

        let expandedMenus = {};

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

        function expandProperMenu() {

          let currentPath = $location.path();
          let menuItem = document.getElementById("sidebar").querySelectorAll('[href="' + currentPath + '"]');

          menuItem = menuItem[0];

          if (menuItem) {
            if (
              menuItem.parentElement.parentElement.classList.contains(
                "collapse"
              )
            ) {
              menuItem.parentElement.parentElement.classList.add("show");
            }
          }

        }

        EventEmitterService.on(
          EventEmitterService.namespace.APPLICATIONS,
          getApplications
        );

        EventEmitterService.on(
          EventEmitterService.namespace.USERS,
          getMembersAndAdmins
        );

        EventEmitterService.on(
          EventEmitterService.namespace.PROFILE,
          getProfile
        );

        EventEmitterService.on(
            EventEmitterService.namespace.AVATAR,
            getImage
        );

      }
    };
  }
})(angular);
