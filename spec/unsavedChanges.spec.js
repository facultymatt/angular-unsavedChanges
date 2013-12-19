describe('UnsavedChanges', function() {

    var unsavedDev,
        rootScope,
        formTemplate,
        pageNav1,
        pageNav2,
        scope,
        theForm,
        theClearButton,
        theSubmitButton,
        pageController,
        unsavedDevProviderCache,
        defaultMessageReload,
        defaultMessageNavigate,
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
    beforeEach(module('mm.unsavedChanges'));

    // cache providers
    // beforeEach(module(function(unsavedDevProvider) {
    //     unsavedDevProviderCache = unsavedDevProvider;
    // }));

    beforeEach(module(function($compileProvider, $routeProvider, $provide) {

        // cache the provider for access in tests
        $routeProviderCache = $routeProvider;

        // setup test routes
        $routeProviderCache
            .when('/page1', {})
            .when('/page2', {})
            .otherwise({
                redirectTo: '/page1'
            });

        mock = {
            alert: jasmine.createSpy(),
            alert: jasmine.createSpy(),
            scrollTo: jasmine.createSpy()
        };

        //$provide.value('$window', mock);

        // setup message defaults
        defaultMessageReload = "You will lose unsaved changes if you reload this page";
        defaultMessageNavigate = "You will lose unsaved changes if you leave this page";

    }));

    // modules
    beforeEach(inject(function(_$rootScope_, _$controller_, _$compile_, _$sniffer_, _$location_, _$window_, _$route_) {

        // grab our injected variables
        $sniffer = _$sniffer_;
        $compile = _$compile_;
        $location = _$location_;
        $window = _$window_;
        $route = _$route_;
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        scope = $rootScope.$new();

        //var ngView = angular.element('<div ng-view></div>');
        //$compile(ngView)($rootScope);


        // spies!
        spyOn($window, 'alert').andCallFake('hello');
        spyOn($window, 'confirm').andCallFake('hello');

        // build fake nav to simulate page navigation
        // @note we could do this by broadcasting $locationChangeStart
        // but this will simulate our terminated navigation too
        //
        // @note our page nav will be present across all pages
        // and tests, so we setup here. Our forms in contrast we setup 
        // in test beforeEach tests. 
        pageNav1 = angular.element('<a id="page1" href="#/page1">Page1</a>');
        pageNav2 = angular.element('<a id="page2" href="#/page2">Page2</a>');

        $compile(pageNav1)(scope);
        $compile(pageNav2)(scope);

        // start all tests from first page
        $location.url('/page1');

        formTemplate = angular.element('<div>' +
            '<form name="testForm" unsaved-warning-form>' +
            '<input name="test" type="text" ng-model="test"/>' +
            '<button id="submit" type="submit"></button>' +
            '<button id="clear" type="button" unsaved-warning-clear></button>' +
            '</form>' +
            '</div>');

        $compile(formTemplate)(scope);

        // selector for the form, since it's within the group
        theForm = scope.$$childTail.testForm;
        theClearButton = formTemplate.find('#clear');
        theSubmitButton = formTemplate.find('#submit');

    }));

    ddescribe('Directives', function() {

        describe('Clear', function() {

            it('registers with attr unsaved-warning-clear', function() {
                expect(theClearButton.hasClass('ng-scope')).toEqual(true);
            });

            // it should be registered within a form...
            // @todo throw warning or document
            it('sets parent form to setPristine() when clicked', function() {});

        });

        describe('Form', function() {

            it('registers with attr unsaved-warning-form', function() {
                expect(formTemplate.hasClass('ng-scope')).toEqual(true);
            });

            // we don't expose the registered elements so we'd need to spy on this?
            // or maybe provide a getter but not setter... yeah! 
            // it('un-registers form when scope is destroyed', function() {});
            ddescribe('when form is dirty', function() {

                beforeEach(function() {
                    theForm.$dirty = true;
                    theForm.$valid = false;
                    theForm.$invalid = true;
                    scope.$apply();
                })

                it('will message user when reloading page', function() {
                    $route.reload();
                    expect($window.confirm).toHaveBeenCalledWith(defaultMessageReload);
                    $window.confirm();
                });

                it('will message user when clicking link away', function() {
                    $location.path('/page2');
                    expect($window.confirm).toHaveBeenCalledWith(defaultMessageNavigate);
                    $window.confirm();
                });

                // @note might be nice to incorporate ngRouter and 
                // check for this? 
                //it('will message user when changing state', function() {});

                it('will message user when navigating back', function() {});

            });

        });

    });

    describe('Provider Configuration', function() {

        describe('enable logging', function() {

            it('gets logging enabled setting', function() {});

            it('sets logging enabled', function() {});

            describe('logging enabled', function() {

                it('logs messages with 1 argument', function() {});

                it('logs messages with 2 or more arguments', function() {});

            });

            describe('logging disabled', function() {

                // @todo spy on logger
                it('does not log', function() {});

            });


        });

        describe('custom navigate message', function() {

            it('has a nice default', function() {});

            it('sets', function() {});

            it('gets', function() {});

        });

        describe('custom reload message', function() {

            it('has a nice default', function() {});

            it('sets', function() {});

            it('gets', function() {});

        });

        describe('watch for custom event', function() {

            it('defaults to $locationChangeStart', function() {});

            it('sets', function() {});

            it('gets', function() {});

        });

        describe('use translate service', function() {

            it('can use translate service if available', function() {});

        });

    });

});
