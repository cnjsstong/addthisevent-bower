/*
 ---
 name: AddThisEvent Angularjs

 license: MIT-style license

 requires: [angular, addthisevent]
 provides: [AddThisEvent]

 ...
 */

(function (window, angular) {
    'use strict';

    // Module global settings.
    var settings = {};

    angular.module('angularAddThisEvent', [])
        // Declare module settings value
        .value('settings', settings)

        .provider('AddThisEvent', [function () {
            var initDeferred;

            this.init = function (initSettings) {
                if (angular.isObject(initSettings)) {
                    angular.extend(settings, initSettings);
                }
            };

            this.$get = ['$q', '$window', function ($q, $window) {
                return {
                    init: function () {
                        initDeferred = $q.defer();
                        $window.addthisevent.settings(settings);
                        initDeferred.resolve();
                    },
                    refresh: function () {
                        if (!initDeferred) {
                            this.init();
                        }
                        return initDeferred.promise.then(function () {
                            return $window.addthisevent.refresh();
                        });
                    }
                }
            }]
        }])

        .directive('addToCalendar', ['AddThisEvent', '$timeout', function (AddThisEvent, $timeout) {
            return {
                restrict: 'A',
                scope: false,
                link: function (scope, element) {
                    element.css('display', 'none');
                    AddThisEvent.refresh().then(function () {
                        element.css('display', 'block');
                    });
                }
            };
        }]);
})(window, angular);

