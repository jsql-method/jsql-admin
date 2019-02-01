(function(angular) {
  "use strict";

  angular
    .module("jsql")
    .controller("RegisterController", [
      "AuthService",
      "$state",
      "$uibModal",
      "$timeout",
      RegisterController
    ]);

  /**
   * @ngInject
   */
  function RegisterController(AuthService, $state, $uibModal, $timeout) {

    var vm = this;
    var onTouchEmail = false;
    var onTouchPassword = false;
    var onTouchRepeatPassword = false;
    var onTouchFirstName = false;
    var onTouchLastName = false;
    var ontTouchPlan = false;
    var plans = [
        'Starter',
        'Business',
        'Large'
    ];

    vm.params = null;
    vm.vissibleSelect = false;
    vm.plan = "";
    vm.disableSelect = false;
    vm.email = "";
    vm.password = "";
    vm.repeatPassword = "";
    vm.firstName = "";
    vm.lastName = "";
    vm.messages = {
      email: [],
      password: [],
      repeatPassword: [],
      firstName: [],
      lastName: [],
      plan: []
    };

    vm.generalMessage = "";

    vm.go = go;
    vm.activeSelect = activeSelect;
    vm.choosePlan = choosePlan;
    vm.setVissibleSelect = setVissibleSelect;
    vm.validateRegisterForm = validateRegisterForm;
    vm.validateEmail = validateEmail;
    vm.validatePassword = validatePassword;
    vm.validateRepeatPassword = validateRepeatPassword;
    vm.validateFirstName = validateFirstName;
    vm.validateLastName = validateLastName;
    vm.validatePlan = validatePlan;
    vm.submitRegister = submitRegister;
    vm.openModal = openModal;

    init();

    function init() {

      if (AuthService.isLogged()) {
        window.location.href = "/";
      }
      getUrl(window.location.href);

    }

    function go() {

      $state.go("login");

    }

    function activeSelect() {

        document.getElementById('select-register').click();
        document.getElementById('select-register').focus();

    }

    function setVissibleSelect() {

        $timeout(function () {

          vm.vissibleSelect = !vm.vissibleSelect;
            if(vm.vissibleSelect === false) {
                vm.validatePlan(true);
            }

        },100);

    }

    function choosePlan(plan) {

      vm.plan = plan;

    }

    function getUrl(url) {

      let params = {};

      if (url.search("plan") !== -1) {

        let index = url.search("plan");
        let text = url.substr(index + 5);

        vm.disableSelect = true;
        vm.plan = plans[parseInt(text) - 1];
        vm.params = params;

      }

    }

    /**
     * Validate Register Form
     */

     function validateRegisterForm() {

      onTouchEmail = true;
      onTouchPassword = true;
      onTouchRepeatPassword = true;
      onTouchFirstName = true;
      onTouchLastName = true;
      ontTouchPlan = true;

      vm.generalMessage = "";

      vm.validateEmail();
      vm.validatePassword();
      vm.validateFirstName();
      vm.validateLastName();
      vm.validatePlan();

      for (var messagesValidate in vm.messages) {
        if (vm.messages[messagesValidate].length > 0) {
          return;
        }
      }

      vm.submitRegister();
    }

    function validateEmail(result) {

      if (result !== undefined) {
        onTouchEmail = result;
      }

      if (!onTouchEmail) {
        return;
      }

      var regEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i;

      vm.messages.email = [];

      if (vm.email.length === 0) {
        vm.messages.email.push("Email can't be blank.");
      }

      if (vm.email && regEmail.test(vm.email) == false) {
        vm.messages.email.push("Incorrect email address.");
      }

    }

    function validatePassword(result) {

      if (result !== undefined) {
        onTouchPassword = result;
      }

      if (!onTouchPassword) {
        return;
      }

      var regPassword = /^(?=\S*[a-zA-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,}$/;

      vm.messages.password = [];

      if (vm.password.length === 0) {
        vm.messages.password.push("Password can't be blank!");
      }

      if (vm.password && regPassword.test(vm.password) == false) {
        vm.messages.password.push(
          "Minimum 8 characters, at least one letter, one number and one special character!"
        );
        vm.validateRepeatPassword();
        return;
      }

      if (vm.password.length > 100) {
        vm.messages.password.push("Max length number of characters 100!");
      }
      vm.validateRepeatPassword();

    }

    function validateRepeatPassword(result) {

      if (result !== undefined) {
        onTouchRepeatPassword = result;
      }

      if (!onTouchRepeatPassword) {
        return;
      }

      vm.messages.repeatPassword = [];

      if (vm.password !== vm.repeatPassword) {
        vm.messages.repeatPassword.push("Passwords does not match!");
      }

    }

    function validateFirstName(result) {

      if (result !== undefined) {
        onTouchFirstName = result;
      }

      if (!onTouchFirstName) {
        return;
      }

      var regFirstName = /^[A-Za-zęóąśłżźćńĘÓĄŚŁŻŹĆŃ]{1,}[\s]{0,1}[A-Za-zęóąśłżźćńĘÓĄŚŁŻŹĆŃ]{0,}$/m;

      vm.messages.firstName = [];

      if (vm.firstName.length === 0) {
        vm.messages.firstName.push("First name can't be blank!");
      }

      if (vm.firstName && regFirstName.test(vm.firstName) == false) {
        vm.messages.firstName.push("Only letters. Max two names!");
        return;
      }

      if (vm.firstName.length > 100) {
        vm.messages.firstName.push("Max length number of characters 100!");
      }

    }

    function validateLastName(result) {

      if (result !== undefined) {
        onTouchLastName = result;
      }

      if (!onTouchLastName) {
        return;
      }

      var regLastName = /^[A-Za-zęóąśłżźćńĘÓĄŚŁŻŹĆŃ][A-Za-zęóąśłżźćńĘÓĄŚŁŻŹĆŃ-]{0,}$/;

      vm.messages.lastName = [];

      if (vm.lastName.length === 0) {
        vm.messages.lastName.push("Last name can't be blank!");
      }

      if (vm.lastName && regLastName.test(vm.lastName) == false) {
        vm.messages.lastName.push(
          "Only letters. Max two elements separated by a hyphen!"
        );
        return;
      }

      if (vm.lastName.length > 100) {
        vm.messages.lastName.push("Max length number of characters 100!");
      }

    }

    function validatePlan(result) {

      if (result !== undefined) {
            ontTouchPlan = result;
        }

        if (!ontTouchPlan) {
            return;
        }

        vm.messages.plan = [];

        if(vm.plan === "") {
            vm.messages.plan.push("The plan must be selected")
        }

    }

    function submitRegister() {

       let data = {
        email: vm.email,
        password: vm.password,
        firstName: vm.firstName,
        lastName: vm.lastName
      };

      AuthService.register(data).then(function(result) {

        if (result.data.code === 200) {
          vm.openModal();
        } else {
          vm.generalMessage = result.data.description;
        }
      });

    }

    function openModal() {

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
              message: "Check your email and activate your account!"
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

    }
  }
})(angular);
