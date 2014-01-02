describe('UnsavedChanges', function() {

    var unsavedDev,
        rootScope,
        formTemplate,
        ngView,
        pageNav1,
        pageNav2,
        scope,
        theForm,
        parentScope,
        theClearButton,
        theSubmitButton,
        pageController,
        unsavedChanges,
        unsavedDevProviderCache,
        defaultMessageReload,
        defaultMessageNavigate,
        translateProvider,
        unsavedWarningsConfig,
        formTemplate,
        clearButton,
        $templateCache,
        $routeProviderCache,
        $rootScope,
        $controller,
        $location,
        $provide,
        $route,
        $window,
        $compile,
        $scope;

    beforeEach(module('ngRoute'));
    beforeEach(module('unsavedChanges'));
    beforeEach(module('pascalprecht.translate'));

    // cache providers
    beforeEach(module(function($compileProvider, $routeProvider, $provide, unsavedWarningsConfigProvider, $translateProvider) {

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
            //$scope.state = 'WORKS';
            controllerScope = $scope;
            //console.log('hello?');
        };

        formTemplate = angular.element('<div>' +
            '<form name="testForm" unsaved-warning-form>' +
            '<input id="test" required name="test" type="text" lazy-model="test"/>' +
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

        // mock = {
        //     alert: jasmine.createSpy(),
        //     alert: jasmine.createSpy(),
        //     scrollTo: jasmine.createSpy()
        // };

        // $provide.value('$window', mock);

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
        spyOn(console, 'log').andCallThrough();
        spyOn(controllerScope.testForm, '$setPristine').andCallThrough();

    }));

    describe('Directives', function() {

        describe('Clear', function() {

            //it('registers with attr unsaved-warning-clear', function() {});

            // needs to be registered within a form...
            // @todo throw warning or document
            it('calls $setPristine() on parent form when clicked', function() {
                var clear = formTemplate.find('#clear');
                clear.click();
                controllerScope.$digest();
                expect(controllerScope.testForm.$setPristine).toHaveBeenCalled();
            });

        });

        describe('Form', function() {

            //it('registers with attr unsaved-warning-form', function() {});

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

    describe('Lazy Model', function() {

        var submit, input, reset;

        beforeEach(function() {
            submit = formTemplate.find('#submit');
            input = formTemplate.find('#test');
            reset = formTemplate.find('#clear');
        })

        it('adds ng-model with isolate scope variable to registered elements', function() {
            expect(input.attr('ng-model')).toEqual('buffer');
        });

        it('resets to original model value on form reset', function() {
            controllerScope.testForm.test.$setViewValue('cool beans');
            expect(controllerScope.testForm.test.$modelValue).toEqual('cool beans');
            reset.click();
            expect(controllerScope.testForm.test.$modelValue).toEqual('default value');
        });

        describe('form is invalid', function() {

            beforeEach(function() {
                controllerScope.testForm.test.$setViewValue('');
                controllerScope.$digest();
            });

            describe('on form submit', function() {

                beforeEach(function() {
                    submit.click();
                    controllerScope.$digest();
                });

                it('updates model', function() {
                    expect(controllerScope.test).toEqual('default value');
                });

            });

        });

        describe('form is valid', function() {
            
            beforeEach(function() {
                controllerScope.testForm.test.$setViewValue('cool beans');
            });

            describe('on form submit', function() {

                beforeEach(function() {
                    submit.click();
                    controllerScope.$digest();
                });

                it('does not update model', function() {
                    expect(controllerScope.test).toEqual('cool beans');
                });

            });

        });

    });

});




///
