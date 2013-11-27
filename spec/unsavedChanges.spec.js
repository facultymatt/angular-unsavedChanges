describe('UnsavedChanges', function() {

    var unsavedDev,
        rootScope,
        formTemplate,
        clearTemplate,
        unsavedDevProviderCache,
        $rootScope,
        $compile,
        $scope;

    beforeEach(module('unsavedDev'));

    // cache providers
    // beforeEach(module(function(unsavedDevProvider) {
    //     unsavedDevProviderCache = unsavedDevProvider;
    // }));

    // modules
    beforeEach(inject(function(_$rootScope_, _$compile_) {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
    }));

    describe('Messaging on unsaved changes', function() {

        it('acts on forms with attr `unsaved-changes-form`', function() {});

        it('detects when a form is dirty', function() {});

        it('messages when navigating away from current url', function() {});

        it('messages when reloading page', function() {});

        it('messages when going back', function() {});

        it('works when multiple forms are on the same page', function() {});

    });

    describe('Disregarding unsaved changes', function() {
   
        it('acts on element with attr `unsaved-changes-clear`', function() {});

        it('prevents message on page navigate', function() {});

        it('prevents message on page reload', function() {});

        it('preventing changes is temporary, and message will appear on next dirty form', function() {});

    });

    describe('Clearing messages on form submit', function() {
        
        it('prevents message if form is submitted', function() {});

    });
    
});