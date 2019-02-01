(function(angular) {
  "use strict";

  angular
    .module("jsql")
    .controller("ApplicationsController", ApplicationsController);

  /**
   * @ngInject
   */
  function ApplicationsController(AuthService, DictService, $stateParams, EventEmitterService, ApplicationService, $uibModal, $state) {
    var vm = this;
    var applicationDelete = false;

    vm.application = null;
    vm.id = parseInt($stateParams.id);
    vm.role = localStorage.getItem('_mRole');

    vm.copyToClipboard = copyToClipboard;
    vm.openModalDeleteApplication = openModalDeleteApplication;

    init();

    //--------
    function init() {

      getApplications();

    }

    function getApplications() {

      DictService.applications()
        .then(function(result) {
          vm.application = _.find(result, { id: vm.id });
        })

    }

     function copyToClipboard() {

      try {
        var copyText = document.getElementById("applicationKey");
        copyText.select();
        var successful = document.execCommand("copy");
        if (!successful) throw successful;
        copyText.setSelectionRange(0, 0);
        openModal("Copied to clipboard!", false, "Ok", "success", "Copy");
      } catch (e) {
        openModal(
          "There was an error copying to the clipboard.  Select the text to copy and use Ctrl+C.",
          false,
          "Ok",
          "success",
          "Copy"
        );
      }

    }

    function openModalDeleteApplication() {

      openModal(
        "Are you sure you want to delete this application?",
        true,
        "Yes",
        "warning",
        "Delete Application!",
        deleteApplication
      );

    }

    function deleteApplication() {

      ApplicationService.deleteApplication(vm.id)
        .then(function(result) {

          if (result.data.code === 200) {
            DictService.refresh("applications");
            EventEmitterService.broadcast(
              EventEmitterService.namespace.APPLICATIONS
            );
            EventEmitterService.broadcast(
                EventEmitterService.namespace.DELETE_APPLICATION
            );
            applicationDelete = true;
            openModal(
              "The application has been deleted.",
              false,
              "Ok",
              "success",
              "Delete Application!",
              returnToHome
            );
          }

        })

    }

    EventEmitterService.on(
      EventEmitterService.namespace.APPLICATIONS,
      getApplications
    );

    function openModal(text, vissibleButtonDelete, submitTextButton, clazz, title, callBack) {

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: "app/modals/message/message.html",
        controller: "MessageController",
        controllerAs: "vm",
        resolve: {
          Data: function() {
            return {
              clazz: clazz || "success",
              title: title || "Good job!",
              message: text,
              vissibleButtonDelete: vissibleButtonDelete,
              submit: submitTextButton
            };
          }
        }
      });

      modalInstance.result.then(
        function(result) {
          if (result) {
            if (callBack) callBack();
          }

          if (applicationDelete) {
            applicationDelete = false;
          }
        },
        function() {

          if (callBack && applicationDelete) {
            applicationDelete = false;
            callBack();
          }

        }
      );
    }

    function returnToHome() {

      $state.go("builds");

    }
  }
})(angular);
