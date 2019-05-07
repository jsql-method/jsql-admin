(function (angular) {
    "use strict";

    angular
        .module("jsql")
        .controller("FeedbackController", ["EndpointsFactory", "UtilsService", "$stateParams", FeedbackController]);

    /**
     * @ngInject
     */
    function FeedbackController(EndpointsFactory, UtilsService, $stateParams) {
        var vm = this;

        vm.cons = '';
        vm.props = '';

        vm.submitFeedback = function () {

            var token = $stateParams.token;
            EndpointsFactory.feedback(token, {
                    message: 'CONS: '+vm.cons+', PROPS: '+vm.props
                }).$promise.then(function (result) {

                    if(UtilsService.hasGeneralError(result)){
                        UtilsService.openFailedModal();
                    }else {
                        UtilsService.openSuccessModal(translation.thank_you_feedback, function(){
                            window.location.href = "https://jsql.it";
                        });
                    }


                });
        };
    }
})(angular);
