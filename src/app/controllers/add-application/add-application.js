(function(angular) {
  "use strict";

  angular
    .module("jsql")
    .controller("AddApplicationController", AddApplicationController);

  /**
   * @ngInject
   */
  function AddApplicationController(AuthService, ApplicationService, DictService, EventEmitterService, $uibModal) {

    var vm = this;
    var flag = true;
    var onTouchName = false;

    vm.name = "";
    vm.message = [];

    vm.validateAddApplication = validateAddApplication;
    vm.validateName = validateName;


    function validateAddApplication() {

      onTouchName = true;
      validateName();

      if (vm.message.length === 0) {
        submitAddApplication();
      }

    }

    function validateName(result) {

      vm.message = [];

      if (result !== undefined) {
        onTouchName = result;
      }

      if (!onTouchName) {
        return;
      }

      if (vm.name.length === 0) {
        vm.message.push("Name application can't be blank!");
      }

      if (vm.name.length > 100) {
        vm.message.push("Max length number of characters 100!");
      }

    }

    function submitAddApplication() {

      let data = {
        name: vm.name
      };

      if(flag === false) {
        return;
      }

      flag = false;

      ApplicationService.generateApplication(data)
        .then(function(result) {

          if (result.data.code === 200) {
            openModal("Your application has been added successfully.");
            DictService.refresh("applications");
            EventEmitterService.broadcast(
              EventEmitterService.namespace.APPLICATIONS
            );
          } else {
            openModal(result.data.description);
          }
          flag = true;

        })
        .catch(function () {

          flag = true;

        })

    }

    function openModal(text) {

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: "app/modals/message/message.html",
        controller: "MessageController",
        controllerAs: "vm",
        resolve: {
          Data: function() {

            return {
              clazz: "success",
              title: "Add new application!",
              message: text
            };

          }
        }
      });

      modalInstance.result.then(
          function () {

            vm.name = "";
            onTouchName = false;

          },
          function () {

            vm.name = "";
            onTouchName = false;

          }
      );

    }
  }
})(angular);
