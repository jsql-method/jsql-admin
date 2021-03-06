"use strict";

app.run([
    "$rootScope",
    "DictService",
    "AuthService",
    "$state",
    "EventEmitterService",
    "UtilsService",
    "$timeout",
    function (
        $rootScope,
        DictService,
        AuthService,
        $state,
        EventEmitterService,
        UtilsService,
        $timeout
    ) {


        $rootScope.timed = false;

        $timeout(function(){
            $rootScope.timed = true;
        }, 500);

        DictService.load();

        $rootScope.isLogged = AuthService.isLogged();

        $rootScope.$on("$viewContentLoading", function (event, viewConfig) {
            $("body,html").animate(
                {
                    scrollTop: 0
                },
                300
            );
        });

        $rootScope.$on("$viewContentLoaded", function (event) {
            UtilsService.setTitle();

            // $(".selectize").selectize({
            //     create: true,
            //     sortField: "text"
            // });

        });

        $rootScope.$on("$stateChangeStart", function (
            event,
            toState,
            toParams,
            fromState,
            fromParams
        ) {
            $rootScope.isLogged = AuthService.isLogged();

            if (toState.data) {
                if (toState.data.requiresLogin && !$rootScope.isLogged) {
                    event.preventDefault();
                    $state.go("login");
                } else if (!toState.data.requiresLogin && $rootScope.isLogged) {
                    event.preventDefault();
                    $state.go("builds");
                }

                if (toState.data.roles) {
                    var role = AuthService.getRole();
                    if (toState.data.roles.indexOf(role) > -1) {
                        return;
                    }
                    event.preventDefault();
                    $state.go("builds");
                }
            }
        });
    }
]);
