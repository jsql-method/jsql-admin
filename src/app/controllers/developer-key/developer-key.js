(function(angular) {
  "use strict";

  angular
    .module("jsql")
    .controller("DeveloperKeyController", DeveloperKeyController);

  /**
   * @ngInject
   */
  function DeveloperKeyController(AuthService, $uibModal) {
    var vm = this;

    init();

    vm.copyToClipboard = function() {
      try {
        var copyText = document.getElementById("developerKey");
        copyText.select();
        var successful = document.execCommand("copy");
        if (!successful) throw successful;
        copyText.setSelectionRange(0, 0);
        openModal("Copied to clipboard!");
      } catch (e) {
        openModal(
          "There was an error copying to the clipboard.  Select the text to copy and use Ctrl+C."
        );
      }
    };

    //--------
    function init() {
      vm.memberKey = AuthService.getMemberKey();
      vm.loginRole = localStorage.getItem('_mRole');
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
              title: "Copy!",
              message: text
            };
          }
        }
      });
    }
  }
})(angular);
