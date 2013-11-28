// Tests for LifeView-420
// 
// @see https://code.google.com/p/selenium/wiki/PageObjects
// @see https://github.com/angular/protractor/blob/8580c0c76c5ccd3c55d053e59d8df37b3c4cf35a/docs/api.md


describe('As a user, be able to navigate', function() {

    describe('messaging user when form is dirty', function() {

        describe('upon clicking back', function() {

            var alertDialog;

            beforeEach(function() {
                browser.get('demo/#/page1');
                element(by.id('page2')).click();
                element(by.model('user1.name')).sendKeys('haha');
                browser.navigate().back();
                alertDialog = browser.switchTo().alert();
            });

            it('messages user when attempting to navigate back', function() {
                expect(alertDialog.getText()).toEqual('You will lose unsaved changes if you leave this page');
                // @note if we dont close it here, will remain open
                // and throw error!!!
                alertDialog.accept();
            });

            it('continues to navigate back if user clicks accept', function() {
                alertDialog.accept();
                expect(browser.getCurrentUrl()).toContain('/page1');
            });

            it('stays on same page if user rejects back navigation', function() {
                alertDialog.dismiss();
                expect(browser.getCurrentUrl()).toContain('/page2');
            });

            it('preserves model value on form is user rejects back navigation', function() {
                alertDialog.dismiss();
                expect(element(by.model('user1.name')).getAttribute('value')).toEqual('haha');
            });

        });

    });

});
