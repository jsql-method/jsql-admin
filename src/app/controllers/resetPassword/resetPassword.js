(function(angular) {
  "use strict";

  angular
    .module("jsql")
    .controller("ResetPasswordController", [
      "AuthService",
      "$uibModal",
      "$state",
      ResetPasswordController
    ]);

  /**
   * @ngInject
   */
  function ResetPasswordController(AuthService, $uibModal, $state) {
    var vm = this;

    init();

    function init() {
      if (AuthService.isLogged()) {
        $state.go("/");
      }
    }

    /**
     * Validate Reset Form
     */
    vm.email = "";

    var onTouchEmail = false;

    vm.messages = {
      email: []
    };
    vm.generalMessage = "";

    vm.validateResetPasswordForm = function() {
      onTouchEmail = true;
      vm.generalMessage = "";

      vm.validateEmail();

      for (var messagesValidate in vm.messages) {
        if (vm.messages[messagesValidate].length > 0) {
          return;
        }
      }

      vm.submitResetPassword();
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

    vm.submitResetPassword = function() {
      AuthService.forgotPassword({ email: vm.email }).then(function(result) {
        if (result.data.code === 200) {
          vm.openModal(result.data.description);
        } else {
          vm.generalMessage = result.data.description;
        }
      });
    };

    vm.openModal = function(text) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: "app/modals/message/message.html",
        controller: "MessageController",
        controllerAs: "vm",
        resolve: {
          Data: function() {
            return {
              clazz: "success",
              title: "Good job!",
              message: text
            };
          }
        }
      });

      modalInstance.result.then(
        function() {
          $state.go("login");
        },
        function() {
          $state.go("login");
        }
      );
    };
  }
})(angular);
