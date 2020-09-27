function waitFor(testFx, onReady, timeOutMillis) {
var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3000, //< Default Max Timout is 3s
    start = new Date().getTime(),
    condition = false,
    minTime = 250, //250 ms must be passed initially before trying to run testFx
    interval = setInterval(function() {
        var nowTime = new Date().getTime();
        if ( (nowTime - start >= minTime) && (nowTime - start < maxtimeOutMillis) && !condition ) {
            // If not time-out yet and condition not yet fulfilled
            condition = testFx(); //<    defensive code
        } else if(nowTime - start >= minTime) {
            //if condition is fulfilled or timeout reached, return the page
            onReady();
            clearInterval(interval); //< Stop this interval
        }
    }, 250);
};

var system = require('system');
var page   = require('webpage').create();
var json = JSON.parse(system.args[1]);
var channel_id = json.channel_id
var url    = "https://strah.video/stream?if="+channel_id+"&aspect=&width=&height="
var selector = undefined;
var max_wait = 3000
var min_wait = 1000
var resource_timeout = 3000
var headers = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
    "Referer": "https://strah.video/id/"+channel_id,
    "Sec-Fetch-Mode": "navigate",
    'Sec-Fetch-Site': 'same-origin',
    'Upgrade-Insecure-Requests': "1",
};
var cookies = [];
var output_type = 'html';
var functions = []
var dummy_selector = '#dummy-dummy-____dummy';

var printOutput = function(page){
    if(output_type.toLowerCase() == 'html'){
        console.log(page.content);
    }else{
        console.log(page.plainText);
    }
}

// sane defaults
if(!selector){
    selector = undefined;
    page.onLoadFinished = function(){
        if(!!min_wait){
            var testFx = function (){return false;};
            var onReady = function (){
                printOutput(page);
                phantom.exit();
            };
            waitFor(testFx, onReady, min_wait);
        }else{
            printOutput(page);
            phantom.exit();
        }
    };
}

page.settings.encoding = 'utf8';
page.settings.resourceTimeout = resource_timeout;

var accept_encoding = headers['Accept-Encoding'];
delete headers['Accept-Encoding'];

page.customHeaders = headers;

for(var i in cookies){
    page.addCookie(cookies[i]);
}

// render the page, and run the callback function
page.open(url, function (status) {
    if(status == 'success'){
        functions.forEach(function(func, idx){
            page.evaluateJavaScript(func);
        });
        var testFx = function (){
            return page.evaluate(function(selector) {
                var isVisible = function(elem){
                    if(!!elem){
                        return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
                    } else {
                        return false;
                    }
                };
                return isVisible(document.querySelector(selector));
            }, selector);
        };
        var onReady = function (){
            printOutput(page);
            phantom.exit();
        };
        waitFor(testFx, onReady, max_wait);
        // phantom.exit();
    } else{
        console.log("E: Phantomjs failed to open page: " + url);
        phantom.exit();
    }
});
