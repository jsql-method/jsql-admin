(function (angular) {
    "use strict";

    angular.module("jsql").service("AuthService", AuthService);

    /**
     * @ngInject
     */
    function AuthService(EndpointsFactory, $state) {
        var provider = {};

        /**
         * Nazwa parametru sesji oraz klucza sesji w sessionStorage
         * @type {string}
         */
        provider.SESSION_STORAGE = "_session";
        provider.KEY_STORAGE = "_keychain";
        provider.SHOP_STORAGE = "_s";
        provider.MEMBER_KEY = "_mKey";
        provider.LOGIN_ROLE = "_loginRole";

        provider.SALT = "vsdFSDFsdfvdfsdvGdfgcdvfgvdscsfd";

        /**
         * Funkcja autoryzuje użytkownika w systmie
         * Opcjonalnie callbacki
         * @param user
         * @param successCallback
         * @param errorCallback
         */
        provider.login = function (user, successCallback, errorCallback) {
            EndpointsFactory.login(user)
                .$promise.then(function (result) {

                if (successCallback !== undefined) {
                    successCallback(result);
                }
                provider.setSession(
                    result.data.data.sessionToken,
                    result.data.data.memberKey,
                    result.data.data.auth
                );

                provider.setCookie('auth_expire', 60);

                if (result.data.code === 200) {
                    localStorage.setItem('_mRole', result.data.data.role);
                    localStorage.setItem('_mCompany', result.data.data.companyName);
                    EndpointsFactory.plan(user)
                        .$promise.then(function (result) {
                            provider.setPlan(result.data.data);
                            $state.go('builds');
                        });
                }
                return result;
            })
                .catch(function (data, status) {
                    if (errorCallback !== undefined) {
                        errorCallback();
                    }
                });
        };

        /**
         * Funkcja tworzy użytkownika w systemie
         * Opcjonalnie callbacki
         * @param user
         * @param successCallback
         * @param errorCallback
         */
        provider.register = function (user) {
            return EndpointsFactory.register(user).$promise;
        };

        /**
         * Funkcja resetuje hasło użytkownika w systemie
         * Opcjonalnie callbacki
         * @param user
         * @param successCallback
         * @param errorCallback
         */
        provider.forgotPassword = function (user) {
            return EndpointsFactory.forgotPassword(user).$promise;
        };

        provider.reset = function(token, data) {
            return EndpointsFactory.reset(token,data).$promise;
        };

        /**
         * Funkcja unieważniająca autoryzację użytkownika
         * @param successCallback
         * @param errorCallback
         */
        provider.logout = function () {
            return EndpointsFactory.logout().$promise;
        };

        /**
         * Sprawdza czy istnieje zapisana sesja w przeglądarce
         * @returns {boolean}
         */
        provider.isLogged = function () {
            var cookies = provider.isSessionCookieExist('auth_expire');
            var session = sessionStorage.getItem(provider.SESSION_STORAGE);
            var key = sessionStorage.getItem(provider.KEY_STORAGE);

            if(cookies === false) {
                provider.removeCookies();
                provider.deleteSession();
            }

            if (session && key && cookies) {
                provider.setCookie('auth_expire', 60);
                return true;
            }

            return false;
        };

        /**
         * Usuwa zapisaną sesję w przeglądarce
         */
        provider.deleteSession = function () {
            sessionStorage.removeItem(provider.SESSION_STORAGE);
            sessionStorage.removeItem(provider.KEY_STORAGE);
            sessionStorage.removeItem(provider.MEMBER_KEY);
            sessionStorage.removeItem(provider.LOGIN_ROLE);
        };

        /**
         * Koduje i ustawia hash sesji w przeglądarce
         * @param token
         * @param memberKey
         * @param loginRole
         * @param role
         */
        provider.setSession = function (token, memberKey, loginRole) {
            var role = "USER";
            var session = "";
            var key = [];

            var r = role.length - 1;
            for (var i = 0; i < token.length; i++) {
                if (i % 3 === 0 && r >= 0) {
                    session += role[r];
                    key.push({r: i});
                    r--;
                    key.push({s: token[i]});
                } else {
                    session += token[i];
                }
            }

            sessionStorage.setItem(provider.LOGIN_ROLE, loginRole);
            sessionStorage.setItem(provider.SESSION_STORAGE, session);
            sessionStorage.setItem(provider.KEY_STORAGE, JSON.stringify(key));
            sessionStorage.setItem(provider.MEMBER_KEY, memberKey);
        };

        /**
         * Pobiera token autoryzacyjny dekodując hash sesji
         * @returns {string}
         */
        provider.getToken = function () {
            var session = sessionStorage.getItem(provider.SESSION_STORAGE);
            var key = JSON.parse(sessionStorage.getItem(provider.KEY_STORAGE));

            if (!session || !key) {
                return "";
            }

            var token = session;
            var splitted;
            var splitIndex;
            for (var i = 0; i < key.length; i++) {
                if (key[i].r !== undefined) {
                    splitted = token.split("");
                    splitIndex = key[i].r;
                }
                if (key[i].s !== undefined) {
                    splitted[splitIndex] = key[i].s;
                    token = splitted
                        .toString()
                        .split(",")
                        .join("");
                }
            }

            return token;
        };

        /**
         * Pobiera Rolę zalogowanego użytkownika
         * @returns {string}
         */
        provider.getLoginRole = function () {
            var loginRole = sessionStorage.getItem(provider.LOGIN_ROLE);
            loginRole = loginRole.toString();

            return loginRole;
        };

        /**
         * Pobiera MemberKey z sesji
         * @returns {string}
         */
        provider.getMemberKey = function () {
            var memberKey = sessionStorage.getItem(provider.MEMBER_KEY);
            memberKey = memberKey.toString();

            return memberKey;
        };

        provider.updateUserDetails = function (id, data) {
            return EndpointsFactory.updateUserDetails(id, data).$promise;
        };

        provider.changePassword = function (data) {
            return EndpointsFactory.changePassword(data).$promise;
        };

        provider.activateAccount = function(token) {
            return EndpointsFactory.activateAccount(token).$promise;
        };

        provider.reactivateAccount = function(data) {
            return EndpointsFactory.reactivateAccount(data).$promise
        };

        provider.deactivateAccount = function () {
            return EndpointsFactory.deactivateAccount().$promise;
        };

        provider.getImage = function() {
            return EndpointsFactory.getImage().$promise;
        };

        /**
         * Dodaje Plan ilość użytkowników i aplikacji
         * @returns {string}
         */

        provider.setPlan = function (plan) {
            window.localStorage.setItem("_mPlan", plan.name);
            window.localStorage.setItem("_mUsers", hashUserPlan(plan.maxUsers));
            window.localStorage.setItem("_mApps", hashUserPlan(plan.maxApps));

            function hashUserPlan(value) {
                let numberText = "";
                for (let i = 0; i < 5; i++) {
                    if (i === 2) {
                        numberText += value;
                        continue;
                    }
                    numberText += Math.floor(Math.random() * 9) + 1;
                }
                return numberText;
            }
        };

        provider.setCookie = function (cname, exminutes) {
            var d = new Date();
            var expire_time = d.setTime(d.getTime() + (exminutes  * 1000 + (3600 * 1000)));
            var expires = d.toUTCString();

            window.document.cookie = cname + "=" + expire_time.valueOf() + ";expires=" + expires + ";path=/";
        };

        provider.isSessionCookieExist = function (cname) {
            var d = new Date();
            var fresh_time = d.getTime();

            if (document.cookie.split(';')
                .filter(function(item) { return item.includes(cname + '=') === true })
                .length && parseInt(provider.readCookie(cname)) > fresh_time.valueOf()) {
                return true;
            } else {
                return false;
            }
        };

        provider.readCookie = function (cname) {
            var nameEQ = cname + "=";
            var ca = document.cookie.split(';');

            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1,c.length);
                }
                if (c.indexOf(nameEQ) === 0) {
                    return c.substring(nameEQ.length,c.length);
                }
            }
            return null;
        };

        provider.removeCookies = function () {
            var res = document.cookie;
            var multiple = res.split(";");
            for(var i = 0; i < multiple.length; i++) {
                var key = multiple[i].split("=");
                document.cookie = key[0]+" =; expires = Thu, 01 Jan 1970 00:00:00 UTC";
            }
        };
        
        return provider;
    }
})(angular);
