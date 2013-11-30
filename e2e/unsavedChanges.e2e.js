// Test for Unsaved Changes Directive
//
// @see https://code.google.com/p/selenium/wiki/PageObjects
// @see https://github.com/angular/protractor/blob/8580c0c76c5ccd3c55d053e59d8df37b3c4cf35a/docs/api.md

var alertDialog;

describe('When form is dirty', function() {

    beforeEach(function() {
        // start on page 2, then navigate to page 1
        // so that our history contains a page to go back to
        browser.get('demo/#/page2');
        element(by.id('page1')).click();
        element(by.model('user.name')).sendKeys('haha');
    });

    describe('when user clicks a link', function() {

        beforeEach(function() {
            element(by.id('page2')).click();
            alertDialog = browser.switchTo().alert();
        })

        it('should alert user', function() {
            expect(alertDialog.accept).toBeDefined();
            alertDialog.accept();
        });

        describe('when user accepts alert', function() {
            beforeEach(function() {
                alertDialog.accept();
            });

            it('should go to link', function() {
                expect(browser.getCurrentUrl()).toContain('/page2');
            });
        });


        describe('when user rejects alert', function() {
            beforeEach(function() {
                alertDialog.dismiss();
            });

            it('should stay on page', function() {
                expect(browser.getCurrentUrl()).toContain('/page1');
            });

            // This is important to clear the alert dialog
            // since we are dismissing it, the alert will
            // still appear when the browser reloads to run the next
            // test. So, we need to get ahead of this and clear the
            // alert manually.
            afterEach(function() {
                browser.navigate().refresh();
                alertDialog = browser.switchTo().alert();
                alertDialog.accept();
            });
        });

    });

    describe('when user refreshes page', function() {

        beforeEach(function() {
            browser.navigate().refresh();
            alertDialog = browser.switchTo().alert();
        });

        it('should alert user', function() {
            expect(alertDialog.accept).toBeDefined();
            alertDialog.accept();
        });

        describe('when user accepts alert', function() {

            beforeEach(function() {
                alertDialog.accept();
            });

            it('should refresh the page', function() {
                expect(element(by.model('user.name')).getAttribute('value')).toEqual('');
            });
        });

        describe('when user rejects alert', function() {

            beforeEach(function() {
                alertDialog.dismiss();
            });

            it('should stay on page', function() {
                expect(element(by.model('user.name')).getAttribute('value')).toEqual('haha');
            });

            // This is important to clear the alert dialog
            // since we are dismissing it, the alert will
            // still appear when the browser reloads to run the next
            // test. So, we need to get ahead of this and clear the
            // alert manually.
            afterEach(function() {
                browser.navigate().refresh();
                alertDialog = browser.switchTo().alert();
                alertDialog.accept();
            });
        });

    });

    describe('when user clicks back button', function() {

        beforeEach(function() {
            browser.navigate().back();
            alertDialog = browser.switchTo().alert();
        });

        it('should alert user', function() {
            expect(alertDialog.accept).toBeDefined();
            alertDialog.accept();
        });

        describe('when user accepts alert', function() {
            beforeEach(function() {
                alertDialog.accept();
            });

            it('should navigate back', function() {
                expect(browser.getCurrentUrl()).toContain('/page2');
            });
        });

        describe('when user rejects alert', function() {
            beforeEach(function() {
                alertDialog.dismiss();
            });

            it('should stay on page', function() {
                expect(browser.getCurrentUrl()).toContain('/page1');
            });

            it('should keep form values', function() {
                expect(element(by.model('user.name')).getAttribute('value')).toEqual('haha');
            });

            // This is important to clear the alert dialog
            // since we are dismissing it, the alert will
            // still appear when the browser reloads to run the next
            // test. So, we need to get ahead of this and clear the
            // alert manually.
            afterEach(function() {
                browser.navigate().refresh();
                alertDialog = browser.switchTo().alert();
                alertDialog.accept();
            });
        });

    });

});