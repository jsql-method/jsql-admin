(function(angular) {
  "use strict";

  angular.module("jsql").directive("jsqlHeader", jsqlHeader);

  /**
   * @ngInject
   */
  function jsqlHeader() {
    return {
      restrict: "E",
      replace: true,
      templateUrl: "app/components/header/header.html",
      controllerAs: "vm",
      bindToController: true,
      scope: true,
      controller: function() {}
    };
  }
})(angular);
