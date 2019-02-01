(function(angular) {
  "use strict";

  angular.module("jsql").directive("jsqlFooter", jsqlFooter);

  /**
   * @ngInject
   */
  function jsqlFooter() {
    return {
      restrict: "E",
      replace: true,
      templateUrl: "app/components/footer/footer.html",
      controllerAs: "vm",
      bindToController: true,
      scope: true,
      controller: function(AuthService) {
        var vm = this;

        init();

        function init() {
          vm.isLogged = AuthService.isLogged();
        }
      }
    };
  }
})(angular);
