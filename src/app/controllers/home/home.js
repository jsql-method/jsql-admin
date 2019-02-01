(function(angular) {
  "use strict";

  angular.module("jsql").controller("HomeController", HomeController);

  /**
   * @ngInject
   */
  function HomeController(
    AuthService,
    $uibModal,
    NotificationService,
    UtilsService
  ) {
    var vm = this;

    init();

    //--------
    function init() {}

    vm.openModal = function() {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: "app/modals/message/message.html",
        controller: "MessageController",
        controllerAs: "vm",
        resolve: {
          Data: function() {
            return {
              clazz: "success",
              title: "Udalo sie",
              message: "Dzięki nam świat jest lepszy"
            };
          }
        }
      });

      modalInstance.result.then(function(selectedItem) {}, function() {});
    };

    //  vm.openModal();

    NotificationService.success(
      "Database created",
      "Database has been successfully created"
    );
    NotificationService.error(
      "Installation failed",
      "Database installation has been failed"
    );
    NotificationService.info(
      "License expiration",
      'License expires in 3 days. See <a href="/billing">Billing</a> to renew subscription.'
    );

    var formattedDate = UtilsService.formatDate(new Date(), "dd-MM-yyyy");
  }
})(angular);
