(function(angular) {
  "use strict";

  angular
    .module("jsql")
    .controller("LoginController", ["AuthService", "$state", LoginController]);

  /**
   * @ngInject
   */
  function LoginController(AuthService, $state) {
    var vm = this;

    vm.generalMessage = "";
    vm.email = "";
    vm.password = "";

    vm.messages = {
      email: [],
      password: []
    };

    init();

    //--------
    function init() {}

    vm.go = function() {
      $state.go("register");
    };

    /**
     * Validate Form login
     */

    var onTouchEmail = false;
    var onTouchPassword = false;

    vm.validateLoginForm = function() {
      onTouchEmail = true;
      onTouchPassword = true;

      vm.generalMessage = "";
      vm.validateEmail();
      vm.validatePassword();

      for (var messagesValidate in vm.messages) {
        if (vm.messages[messagesValidate].length > 0) {
          return;
        }
      }

      vm.submitLogin();
    };

    vm.validateEmail = function(result) {
      if (result !== undefined) {
        onTouchEmail = result;
      }

      if (!onTouchEmail) {
        return;
      }

      vm.messages.email = [];

      if (vm.email.length === 0) {
        vm.messages.email.push("Email can't be blank.");
      }
    };

    vm.validatePassword = function(result) {
      if (result !== undefined) {
        onTouchPassword = result;
      }

      if (!onTouchPassword) {
        return;
      }

      vm.messages.password = [];

      if (vm.password.length === 0) {
        vm.messages.password.push("Password can't be blank.");
      }

      if (vm.password.length > 100) {
        vm.messages.password.push("Max length number of characters 100.");
      }
    };

    vm.submitLogin = function() {
      AuthService.login(
        {
          email: vm.email,
          password: vm.password
        },
        function(result) {
          if (result.data.code !== 200) {
            vm.generalMessage = result.data.description;
          }
        },
        function() {}
      );
    };
  }
})(angular);
