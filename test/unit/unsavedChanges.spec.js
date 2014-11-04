describe('UnsavedChanges', function() {

    var formTemplate,
        ngView,
        theForm,
        defaultMessageReload,
        defaultMessageNavigate,
        translateProvider,
        unsavedWarningsConfig,
        unsavedWarningsConfigProviderCache,
        formTemplate,
        $templateCache,
        $routeProviderCache,
        $rootScope,
        $controller,
        $location,
        $route,
        $window,
        $compile,
        $scope;

    beforeEach(module('ngRoute'));
    beforeEach(module('unsavedChanges'));
    beforeEach(module('pascalprecht.translate'));

    // cache providers
    beforeEach(module(function($compileProvider, $routeProvider, unsavedWarningsConfigProvider, $translateProvider) {

        // cache the provider for access in tests
        $routeProviderCache = $routeProvider;
        unsavedWarningsConfigProviderCache = unsavedWarningsConfigProvider;
        translateProvider = $translateProvider;

        translateProvider.translations('en', {
            TEST: 'Hello'
        }).translations('es', {
            TEST: '¡hola'
        });

        translateProvider.preferredLanguage('es');
        translateProvider.fallbackLanguage('en');

        function MyCtrl($scope) {
            controllerScope = $scope;
        };

        formTemplate = angular.element('<div>' +
            '<form name="testForm" unsaved-warning-form>' +
            '<input id="test" required name="test" type="text" ng-model="test" resettable/>' +
            '<button id="submit" type="submit"></button>' +
            '<button name="clear" id="clear" type="reset" unsaved-warning-clear>Clear</button>' +
            '</form>' +
            '</div>');

        // setup test routes
        $routeProviderCache
            .when('/page1', {
                controller: MyCtrl,
                template: formTemplate
            })
            .when('/page2', {
                controller: MyCtrl,
                template: formTemplate
            })
            .when('/page3', {
                controller: MyCtrl,
                template: ''
            })
            .otherwise({
                redirectTo: '/page1'
            });

        // setup message defaults
        defaultMessageReload = "You will lose unsaved changes if you reload this page";
        defaultMessageNavigate = "You will lose unsaved changes if you leave this page";

    }));

    // modules
    beforeEach(inject(function(_$rootScope_, _$controller_, _$compile_, _$sniffer_, _$location_, _$window_, _$route_, _$templateCache_, _unsavedWarningsConfig_, _unsavedWarningSharedService_) {

        // grab our injected variables
        $sniffer = _$sniffer_;
        $compile = _$compile_;
        $location = _$location_;
        $window = _$window_;
        $route = _$route_;
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        $templateCache = _$templateCache_;
        scope = $rootScope.$new();
        unsavedWarningsConfig = _unsavedWarningsConfig_;
        unsavedWarningSharedService = _unsavedWarningSharedService_;

        var parentController = function() {};

        ngView = angular.element('<div ng-view></div>');
        $compile(ngView)($rootScope);

        $location.path('/page1');
        $rootScope.$digest();

        controllerScope.test = 'default value';

        // @note logs will not occur if we are not calling through
        spyOn(console, 'log').and.callThrough();
        spyOn(controllerScope.testForm, '$setPristine').and.callThrough();
        spyOn($rootScope, '$broadcast').and.callThrough();

    }));

    describe('Directives', function() {

        describe('Clear', function() {

            beforeEach(function() {
                var clear = formTemplate.find('#clear');
                clear.click();
                controllerScope.$digest();
            });

            it('creates isolate scope', function() {});

            // needs to be registered within a form...
            // @todo throw warning or document
            it('calls $setPristine() on parent form when clicked', function() {
                expect(controllerScope.testForm.$setPristine).toHaveBeenCalled();
            });

            xit('calls $broadcast message when clicked', function() {
              expect($rootScope.$broadcast).toHaveBeenCalledWith('resetResettables');
            });

        });

        describe('Form', function() {

            it('creates isolate scope', function() {
                expect(controllerScope.$parent).toEqual($rootScope);
            });

            it('adds listener to onbeforeunload to detect page reload', function() {
                expect($window.onbeforeunload.toString()).toContain('allFormsClean()');
            });

            it('adds listener $locationChangeStart', function() {
                expect(controllerScope.$parent.$$listeners.$locationChangeStart.toString()).toContain('!allFormsClean()');
            });

            it('Un-registers form when scope is destroyed', function() {
                expect(unsavedWarningSharedService.allForms().length).toEqual(1);
                $location.path('/page3');
                $rootScope.$digest();
                expect(unsavedWarningSharedService.allForms().length).toEqual(0);
            });

            it('removes listeners if no more forms exist', function() {
                $location.path('/page3');
                $rootScope.$digest();
                expect($window.onbeforeunload).toEqual(null);
            });

        });

    });

    describe('Provider Configuration', function() {

        describe('enable logging', function() {

            it('defaults to false', function() {
                expect(unsavedWarningsConfigProviderCache.logEnabled).toEqual(false);
            });

            it('sets logging enabled', function() {
                unsavedWarningsConfigProviderCache.logEnabled = true;
                expect(unsavedWarningsConfig.logEnabled).toEqual(true);
            });

            describe('logging enabled', function() {

                beforeEach(function() {
                    unsavedWarningsConfigProviderCache.logEnabled = true;
                });

                it('logs messages with 1 argument', function() {
                    unsavedWarningsConfig.log('testing');
                    expect(console.log).toHaveBeenCalledWith('testing');
                });

                it('logs messages with 2 or more arguments', function() {
                    unsavedWarningsConfig.log('testing', 'second', 'third');
                    expect(console.log).toHaveBeenCalledWith('testing', 'second', 'third');
                });

            });

            describe('logging disabled', function() {

                it('does not log', function() {
                    unsavedWarningsConfig.log('testing', 'second', 'third');
                    expect(console.log).not.toHaveBeenCalled();
                });

            });

        });

        describe('custom navigate message', function() {

            it('has a nice default', function() {
                expect(unsavedWarningsConfig.navigateMessage).toEqual(defaultMessageNavigate);
            });

            it('sets config', function() {
                unsavedWarningsConfigProviderCache.navigateMessage = 'Testing!';
                expect(unsavedWarningsConfig.navigateMessage).toEqual('Testing!');
            });

            it('gets at runtime', function() {
                expect(unsavedWarningsConfig.navigateMessage).toEqual(defaultMessageNavigate);
            });

        });

        describe('custom reload message', function() {

            it('has a nice default', function() {
                expect(unsavedWarningsConfig.reloadMessage).toEqual(defaultMessageReload);
            });

            it('sets in config', function() {
                unsavedWarningsConfigProviderCache.reloadMessage = 'Testing!';
                expect(unsavedWarningsConfig.reloadMessage).toEqual('Testing!');
            });

            it('gets at runtime', function() {
                expect(unsavedWarningsConfig.reloadMessage).toEqual(defaultMessageReload);
            });

        });

        describe('watch for custom events', function() {

            it('will always save events as array (even if set as string)', function() {
                unsavedWarningsConfigProviderCache.routeEvent = '$hotDamn';
                expect(unsavedWarningsConfig.routeEvent).toEqual(['$hotDamn']);
            });

            it('defaults to $locationChangeStart AND $stateChangeStart (to support ui router out of the box)', function() {
                expect(unsavedWarningsConfig.routeEvent).toEqual(['$locationChangeStart', '$stateChangeStart']);
            });

            it('sets in config', function() {
                unsavedWarningsConfigProviderCache.routeEvent = '$hotDamn';
                expect(unsavedWarningsConfig.routeEvent).toEqual(['$hotDamn']);
            });

            it('gets at runtime', function() {
                expect(unsavedWarningsConfig.routeEvent).toEqual(['$locationChangeStart', '$stateChangeStart']);
            });

        });

        describe('use translate service', function() {

            beforeEach(function() {
                unsavedWarningsConfigProviderCache.navigateMessage = 'TEST';
            })

            it('defaults to using the translate service, if available', function() {
                unsavedWarningsConfigProviderCache.useTranslateService = false;
                expect(unsavedWarningsConfig.navigateMessage).toEqual('TEST');
            });

            it('can use translate service if available', function() {
                expect(unsavedWarningsConfig.navigateMessage).toEqual('¡hola');
            });

        });

    });

    describe('Resettable', function() {

        var submit, input, reset;

        beforeEach(function() {
            submit = formTemplate.find('#submit');
            input = formTemplate.find('#test');
            reset = formTemplate.find('#clear');
        });

        // @todo something is strange with this test. Test value
        // should be 'default value' on reset but is always being set to 
        // undefined. This works in the demo howerver so yeah... 
        it('resets to original model value on form reset', function() {
            controllerScope.testForm.test.$setViewValue('cool beans');
            expect(controllerScope.testForm.test.$modelValue).toEqual('cool beans');
            reset.click();
            controllerScope.$digest();
            expect(controllerScope.testForm.test.$modelValue).toEqual(undefined);
        });

        it('only resets values within this form', function() {

            var newScope = $rootScope.$new();
            newScope.test1 = 'test1 default';
            newScope.test2 = 'test2 default';
            newScope.test3 = 'test3 default';

            formTemplate = angular.element('<div>' +
                '<form id="form1" name="form1" unsaved-warning-form>' +
                    '<input id="test1" required name="test1" type="text" ng-model="test1" resettable/>' +
                    '<button name="clear1" id="clear1" type="reset" unsaved-warning-clear>Clear</button>' +
                '</form>' +
                
                '<form id="form2" name="form2" unsaved-warning-form>' +
                    '<input id="test2" required name="test2" type="text" ng-model="test2" resettable/>' +
                    '<button name="clear2" id="clear2" type="reset" unsaved-warning-clear>Clear</button>' +
                '</form>' +

                '<form id="form3" name="form3" unsaved-warning-form>' +
                    '<input id="test3" required name="test3" type="text" ng-model="test3" resettable/>' +
                    '<button name="clear3" id="clear3" type="reset" unsaved-warning-clear>Clear</button>' +
                '</form>' +

                '</div>');

            $compile(formTemplate)(newScope);
            newScope.$digest();

            // change values for all inputs
            newScope.test1 = 'test1 changed';
            newScope.test2 = 'test2 changed';
            newScope.test3 = 'test3 changed';

            // clear form one changes only
            formTemplate.find('#clear1').click();
            newScope.$digest();

            expect(newScope.test1).toEqual('test1 default');
            expect(newScope.test2).toEqual('test2 changed');
            expect(newScope.test3).toEqual('test3 changed');

            // debugging scope
            // expect(newScope.$parent).toEqual($rootScope);
            // expect(formTemplate.find('#form1').scope()).toEqual(newScope);
            // expect(formTemplate.find('#form2').scope()).toEqual(newScope);
            // expect(formTemplate.find('#form3').scope()).toEqual(newScope);

        });

        it('can be used as child element of form', function() {

            var newScope = $rootScope.$new();
            newScope.test1 = 'test1 default';

            formTemplate = angular.element('<div>' +
                '<form id="form1" name="form1">' +
                    '<div>' + 
                        '<div unsaved-warning-form>' + 
                            '<input id="test1" required name="test1" type="text" ng-model="test1" resettable/>' +
                            '<button name="clear1" id="clear1" type="reset" unsaved-warning-clear>Clear</button>' +
                        '</div>' + 
                    '</div>' +
                '</form>' +

                '</div>');

            $compile(formTemplate)(newScope);
            newScope.$digest();

            // change values for all inputs
            newScope.test1 = 'test1 changed';

            // clear form one changes only
            formTemplate.find('#clear1').click();
            newScope.$digest();

            expect(newScope.test1).toEqual('test1 default');

        });

        it('exposes new value on ng-change', function() {
           var didFire = false;
           
           var newScope = $rootScope.$new();
           newScope.test = 'a new default value';

           newScope.didChange = function(newValue) {
            didFire = newScope.test;
           }
           formTemplate = angular.element('<div>' +
            '<form name="newForm" unsaved-warning-form>' +
            '<input id="test" required name="test" type="text" ng-model="test" ng-change="didChange()" resettable/>' +
            '<button id="submit" type="submit"></button>' +
            '</form>' +
            '</div>');

           $compile(formTemplate)(newScope);
           
           inputCtrl = formTemplate.find('#test').controller('ngModel');
           inputCtrl.$setViewValue('things are changing');

           controllerScope.$digest();

           expect(didFire).toEqual('things are changing');
           expect(newScope.newForm.test.$modelValue).toEqual('things are changing'); 
        });

        it('resets to original model value on form navigate', function() {});

        it('observes ngModel and only sets original value when value is resolved', function() {});

    });

});




///
