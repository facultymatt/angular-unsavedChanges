// Test for Unsaved Changes Directive
//
// @see https://code.google.com/p/selenium/wiki/PageObjects
// @see https://github.com/angular/protractor/blob/8580c0c76c5ccd3c55d053e59d8df37b3c4cf35a/docs/api.md

var alertDialog;

var cleanUp = function() {
    browser.navigate().refresh();
    alertDialog = browser.switchTo().alert();
    alertDialog.accept();
};

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
        });

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
                // This is important to clear the alert dialog
                // since we are dismissing it, the alert will
                // still appear when the browser reloads to run the next
                // test. So, we need to get ahead of this and clear the
                // alert manually.
                cleanUp();
            });

            describe('user clicks "disregard" button', function() {
                beforeEach(function() {
                    element(by.id('clear')).click();
                });
                describe('user clicks link second time', function() {
                    beforeEach(function() {
                        element(by.id('page2')).click();
                    })
                    it('should navigate to page', function() {
                        expect(browser.getCurrentUrl()).toContain('/page2');
                    });
                });
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
                cleanUp();
            });

            describe('user clicks "disregard" button', function() {
                beforeEach(function() {
                    element(by.id('clear')).click();
                });
                describe('user refreshes page second time', function() {
                    beforeEach(function() {
                        browser.navigate().refresh();
                    })
                    it('should navigate to page', function() {
                        expect(element(by.model('user.name')).getAttribute('value')).toEqual('');
                    });
                });
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
                cleanUp();
            });

            it('should keep form values', function() {
                expect(element(by.model('user.name')).getAttribute('value')).toEqual('haha');
                cleanUp();
            });

            describe('user clicks "disregard" button', function() {
                beforeEach(function() {
                    element(by.id('clear')).click();
                });
                describe('user clicks back second time', function() {
                    beforeEach(function() {
                        browser.navigate().back();
                    })
                    it('should navigate back', function() {
                        expect(browser.getCurrentUrl()).toContain('/page2');
                    });
                });
            });
        });

    });

    describe('user dismisses multiple times', function() {

        afterEach(function() {
            browser.navigate().refresh();
            alertDialog = browser.switchTo().alert();
            alertDialog.accept();
        });

        describe('user clicks link, dismisses, then clicks link again', function() {

            beforeEach(function() {
                element(by.id('page2')).click();
                alertDialog = browser.switchTo().alert();
                alertDialog.dismiss();
                element(by.id('page2')).click();
                alertDialog = browser.switchTo().alert();
                alertDialog.dismiss();
            });

            it('should not navigate', function() {
                expect(browser.getCurrentUrl()).toContain('/page1');
            });

            it('should keep form values', function() {
                expect(element(by.model('user.name')).getAttribute('value')).toEqual('haha');
            });

        });

        describe('user clicks link, dismisses, then refreshes page', function() {

            beforeEach(function() {
                element(by.id('page2')).click();
                alertDialog = browser.switchTo().alert();
                alertDialog.dismiss();
                browser.navigate().refresh();
                alertDialog = browser.switchTo().alert();
                alertDialog.dismiss();
            });

            it('should not refresh', function() {
                expect(browser.getCurrentUrl()).toContain('/page1');
            });

            it('should keep form values', function() {
                expect(element(by.model('user.name')).getAttribute('value')).toEqual('haha');
            });

        });

        describe('user refreshes, dismisses, then clicks link', function() {

            beforeEach(function() {
                browser.navigate().refresh();
                alertDialog = browser.switchTo().alert();
                alertDialog.dismiss();
                element(by.id('page2')).click();
                alertDialog = browser.switchTo().alert();
                alertDialog.dismiss();
            });

            it('should not refresh', function() {
                expect(browser.getCurrentUrl()).toContain('/page1');
            });

            it('should keep form values', function() {
                expect(element(by.model('user.name')).getAttribute('value')).toEqual('haha');
            });

        });

        describe('user refreshes, dismisses, then refreshes', function() {

            beforeEach(function() {
                browser.navigate().refresh();
                alertDialog = browser.switchTo().alert();
                alertDialog.dismiss();
                browser.navigate().refresh();
                alertDialog = browser.switchTo().alert();
                alertDialog.dismiss();
            });

            it('should not refresh', function() {
                expect(browser.getCurrentUrl()).toContain('/page1');
            });

            it('should keep form values', function() {
                expect(element(by.model('user.name')).getAttribute('value')).toEqual('haha');
            });

        });

    });

    describe('disregard changes button', function() {
      
        beforeEach(function() {
            element(by.id('clear')).click();
        });  

        it('should navigate without message', function() {});

        it('should refresh without message', function() {});

        it('should go back without message', function() {});

        describe('user makes changes on next page', function() {
            
            it('should message on navigate', function() {});

            it('should message on refresh', function() {});

            it('should message on back', function() {});

        });

    });

});

describe('When form not dirty', function() {

    beforeEach(function() {
        // start on page 2, then navigate to page 1
        // so that our history contains a page to go back to
        browser.get('demo/#/page2');
        element(by.id('page1')).click();
    });

    describe('when user clicks back', function() {
        beforeEach(function() {
            browser.navigate().back();
        });
        it('should go back', function() {
            expect(browser.getCurrentUrl()).toContain('/page2');
        });
    });

    describe('when user clicks link', function() {
        beforeEach(function() {
            element(by.id('page2')).click();
        });
        it('should navigate to link', function() {
            expect(browser.getCurrentUrl()).toContain('/page2');
        });
    });

    describe('when user refresh', function() {
        beforeEach(function() {
            element(by.model('outsideForm')).sendKeys('reload');
            browser.navigate().refresh();
        });
        it('should refresh', function() {
            expect(element(by.model('outsideForm')).getAttribute('value')).toEqual('');
        });
    });

});







