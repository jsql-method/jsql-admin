"use strict";

var app = angular
    .module("jsql", [
        "templates-main",
        "ui.router",
        "ngRoute",
        "ngSanitize",
        "ngAnimate",
        "ngStorage",
        "ngCookies",
        "ui.bootstrap",
        "constants",
        "angularjs-dropdown-multiselect"
    ])
    .config([
        "$httpProvider",
        "$provide",
        function ($httpProvider, $provide) {
            $httpProvider.defaults.useXDomain = true;
            delete $httpProvider.defaults.headers.common["X-Requested-With"];

            $provide.factory("myHttpInterceptor", [
                "$injector",
                "$q",
                function ($injector, $q) {
                    return {
                        response: function (response) {
                            return response || $q.when(response);
                        },
                        responseError: function (rejection) {
                            if (rejection.status == 401 || rejection.status == 403) {
                                $injector.get("AuthService").deleteSession();
                                // $injector.get('$state').go('login');
                            }
                            return $q.reject(rejection);
                        }
                    };
                }
            ]);
            $httpProvider.interceptors.push("myHttpInterceptor");
        }
    ])
    .config(['$locationProvider', function ($locationProvider) {

        if (window.history && window.history.pushState) {
            $locationProvider.html5Mode(true);
        }

    }])
    .config(['$uibTooltipProvider', function ($uibTooltipProvider) {
        $uibTooltipProvider.options({
            appendToBody: true
        });
    }])
    .config(['$qProvider', function ($qProvider) {
        $qProvider.errorOnUnhandledRejections(true);
    }])
    .config([
        "$stateProvider",
        "$urlRouterProvider",
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state("home", {
                    url: "/",
                    templateUrl: "app/controllers/home/home.html",
                    controller: "HomeController",
                    controllerAs: "vm",
                    data: {
                        requiresLogin: true,
                        title: 'JSQL - Home',
                        shortTitle: 'Home'
                    }
                })
                .state("profile", {
                    url: "/profile",
                    templateUrl: "app/controllers/profile/profile.html",
                    controller: "ProfileController",
                    controllerAs: "vm",
                    data: {
                        requiresLogin: true,
                        title: 'JSQL - Profile',
                        shortTitle: 'Profile'
                    }
                })
                .state("developerKey", {
                    url: "/developer-key",
                    templateUrl: "app/controllers/developer-key/developer-key.html",
                    controller: "DeveloperKeyController",
                    controllerAs: "vm",
                    data: {
                        requiresLogin: true,
                        title: 'JSQL - Developer key',
                        shortTitle: 'Developer key'
                    }
                })
                .state("builds", {
                    url: "/builds",
                    templateUrl: "app/controllers/builds/builds.html",
                    controller: "BuildsController",
                    controllerAs: "vm",
                    data: {
                        requiresLogin: true,
                        title: 'JSQL - Builds',
                        shortTitle: 'Builds'
                    }
                })
                .state("addApplication", {
                    url: "/add-application",
                    templateUrl: "app/controllers/add-application/add-application.html",
                    controller: "AddApplicationController",
                    controllerAs: "vm",
                    data: {
                        requiresLogin: true,
                        roles: ['ADMIN', 'COMPANY_ADMIN', 'APP_ADMIN'],
                        title: 'JSQL - New application',
                        shortTitle: 'Add application'
                    }
                })
                .state("application", {
                    url: "/application/:id",
                    templateUrl: "app/controllers/applications/applications.html",
                    controller: "ApplicationsController",
                    controllerAs: "vm",
                    data: {
                        requiresLogin: true,
                        title: 'JSQL - :name - application',
                        shortTitle: ':name - details'
                    }
                })
                .state("queries", {
                    url: "/queries/:id",
                    templateUrl: "app/controllers/queries/queries.html",
                    controller: "QueriesController",
                    controllerAs: "vm",
                    data: {
                        requiresLogin: true,
                        title: 'JSQL - :name - queries',
                        shortTitle: ':name - queries'
                    }
                })
                .state("security", {
                    url: "/security/:id",
                    templateUrl: "app/controllers/security/security.html",
                    controller: "SecurityController",
                    controllerAs: "vm",
                    data: {
                        requiresLogin: true,
                        roles: ['ADMIN', 'COMPANY_ADMIN', 'APP_ADMIN'],
                        title: 'JSQL - :name - security',
                        shortTitle: ':name - security'
                    }
                })
                .state("traffic", {
                    url: "/traffic",
                    templateUrl: "app/controllers/traffic/traffic.html",
                    controller: "TrafficController",
                    controllerAs: "vm",
                    data: {
                        requiresLogin: true,
                        title: 'JSQL - Traffic',
                        shortTitle: 'Traffic'
                    }
                })
                .state("team", {
                    url: "/developers",
                    templateUrl: "app/controllers/team/team.html",
                    controller: "TeamController",
                    controllerAs: "vm",
                    data: {
                        requiresLogin: true,
                        roles: ['ADMIN', 'COMPANY_ADMIN', 'APP_ADMIN'],
                        title: 'JSQL - Developers',
                        shortTitle: 'Developers'
                    }
                })
                .state("administrators", {
                    url: "/administrators",
                    templateUrl: "app/controllers/administrators/administrators.html",
                    controller: "AdministratorsController",
                    controllerAs: "vm",
                    data: {
                        requiresLogin: true,
                        roles: ['ADMIN', 'COMPANY_ADMIN'],
                        title: 'JSQL - Administrators',
                        shortTitle: 'Administrators'
                    }
                })
                .state("billing", {
                    url: "/billing",
                    templateUrl: "app/controllers/billing/billing.html",
                    controller: "BillingController",
                    controllerAs: "vm",
                    data: {
                        requiresLogin: true,
                        roles: ['ADMIN', 'COMPANY_ADMIN'],
                        title: 'JSQL - Billing',
                        shortTitle: 'Billing'
                    }
                })
                .state("login", {
                    url: "/login",
                    templateUrl: "app/controllers/login/login.html",
                    controller: "LoginController",
                    controllerAs: "vm",
                    data: {
                        requiresLogin: false,
                        title: 'JSQL - Sign in',
                        shortTitle: 'Sign in'
                    }
                })
                .state("activate", {
                    url: "/activate/:token",
                    templateUrl: "app/controllers/reset/reset.html",
                    controller: "ResetController",
                    controllerAs: "vm",
                    data: {
                        requiresLogin: false,
                        title: 'JSQL - Activation',
                        shortTitle: 'Activation'
                    }
                })
                .state("forgotPassword", {
                    url: "/forgot-password",
                    templateUrl: "app/controllers/resetPassword/resetPassword.html",
                    controller: "ResetPasswordController",
                    controllerAs: "vm",
                    data: {
                        requiresLogin: false,
                        title: 'JSQL - Forgot password',
                        shortTitle: 'Forgot password'
                    }
                })
                .state("reset", {
                    url: "/reset-password/:token",
                    templateUrl: "app/controllers/reset/reset.html",
                    controller: "ResetController",
                    controllerAs: "vm",
                    data: {
                        requiresLogin: false,
                        title: 'JSQL - Reset',
                        shortTitle: 'Reset'
                    }
                })
                .state("feedback", {
                    url: "/feedback/:token",
                    templateUrl: "app/controllers/feedback/feedback.html",
                    controller: "FeedbackController",
                    controllerAs: "vm",
                    data: {
                        requiresLogin: false,
                        title: 'JSQL - Feedback',
                        shortTitle: 'Feedback'
                    }
                })
                .state("payment", {
                    url: "/successful-payment",
                    templateUrl: "app/controllers/payment/payment.html",
                    controller: "PaymentController",
                    controllerAs: "vm",
                    data: {
                        requiresLogin: false,
                        title: 'JSQL - Successful Payment',
                        shortTitle: 'Successful Payment'
                    }
                });

            $urlRouterProvider.otherwise('/');
        }
    ])
    .constant("months", [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ])
    .constant("dateFormat", {
        format: "dd-MM-yyyy"
    });

