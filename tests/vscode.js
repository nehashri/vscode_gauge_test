var Application = require('spectron').Application
var assert = require('assert')
var path = require('path')

var app = new Application({
    path: '/Users/nehashrl/Documents/gauge/gauge-vscode/.vscode-test/Visual Studio Code.app/Contents/MacOS/Electron',
    args: ['/Users/nehashrl/Documents/gauge/gauge-vscode/out/test/testdata/sampleProject', '--extensionDevelopmentPath=/Users/nehashrl/Documents/gauge/gauge-vscode']
});

var testDataPath = '/Users/nehashrl/Documents/gauge/gauge-vscode/out/test/testdata/sampleProject';

gauge.hooks.beforeScenario(function (context, done) {
    app.start().then(() => {
        return app.client.waitUntilWindowLoaded(10000)
    }).then(done);
});

gauge.hooks.afterScenario(function (context, done) {
    if (app && app.isRunning()) {
        app.stop().then((result) =>{
            done()
        }, (e) => {
            done(e)
        });
    }
});

gauge.step("Switch to window with title <windowTitle>", function (windowTitle, done) {
    if (app && app.isRunning()) {
        switchWindowByTitle(windowTitle, done);
    }
});

gauge.step("Open file <fileName>", function (fileName, done) {
    app.client.click('a.label-name=' + fileName).then((result) =>{
        done()
    }, (e) => {
        done(e)
    });
});

gauge.step("Write <* A> in file", function (text, done) {
    app.webContents.insertText('aksdfjlsakdjfkj')
});


gauge.step("Pause for <time> seconds", function (time, done) {
    // app.client.debug().then(done)
    setTimeout(done, time)
});

function switchWindowByTitle(windowTitle, done) {
    app.client.getTabIds().then(function (handles) {
        var handleIndex = 0;
        var checkTitle = function (title) {
            if (title.endsWith(windowTitle)) {
                done();
            } else {
                handleIndex++;
                if (handleIndex < handles.length) {
                    switchWindow(handles[handleIndex], checkTitle);
                } else {
                    // the window may not be loaded yet, so call itself again
                    switchWindowByTitle(windowTitle, done);
                }
            }
        };
        switchWindow(handles[handleIndex], checkTitle);
    });
}

function switchWindow(windowHandle, callback) {
    app.client.switchTab(windowHandle).then(function () {
        app.client.title().then(function (result) {
            callback(result.value);
        });
    });
}