var config = {
  pageSttings: {
    loadImages: false
  }
};
var casper = require('casper').create(config);
var tools = require('./source/' + casper.cli.args[0]);
if(casper.cli.args[0] == 'Tradetang') {
  var url = tools.searchUrl + casper.cli.args[1].replace(/ /g,'-') + '.html'
} else {
  var url = tools.searchUrl + casper.cli.args[1];
}
casper = tools.expend(casper);

casper.on('remote.message', function(msg) {
  this.log(msg, 'error');
});

casper.reopen = function (callback) {
  casper.log('reopen', 'error');
  if (300 == casper.evaluate(function() {
    return document.documentElement.scrollHeight;
  })) {
    casper.thenOpen(url, function () {
      reopen(callback);
    });
  } else {
    if (callback) callback();
  }
};

// Scroll down until at the bottom of the page.
casper.scrollToBottomSoftly = function (time) {
  var PAGE_HEIGHT = this.evaluate(function() { return __utils__.getDocumentHeight(); });
  var HEIGHT_GAP = 200;
  var INIT_HEIGHT = 600;
  var TIME_GAP = time / ((PAGE_HEIGHT - INIT_HEIGHT) / HEIGHT_GAP);

  this.log("Start Scrolling. PAGE_HEIGHT: " + PAGE_HEIGHT + ", TIME_GAP: " + TIME_GAP, "info");
  recursion(this, INIT_HEIGHT);

  function recursion(that, y) {
    that.wait(TIME_GAP, function() {
      that.scrollTo(0, y);
      this.log("Now height: " + y, "info");

      if (y >= PAGE_HEIGHT) {
        that.scrollToBottom();
        that.wait(TIME_GAP);
        return;
      } else {
        recursion(that, y + HEIGHT_GAP);
      }
    });
  }
};

casper.nextOrExit = function (next, then) {
  this.then(function () {
    if (this.evaluate(function (next) { return __utils__.exists(next); }, next)) {
      this.thenOpen(this.evaluate(function (next) { return __utils__.findOne(next).getAttribute('href'); }, next), then);
    } else {
      this.exit();
    }
  });
};

function scrapePage () {
  var data = {};
  casper.init();
  casper.then(function () {
    this.log('scrapePage', 'debug');
    var methods = tools.scrapers.filter(function (scraper) {
      return casper.evaluate(scraper.condition);
    });

    if (methods.length === 0) {
      data.error = {
        message: 'No scraper matching.',
        url: casper.getCurrentUrl(),
        html: casper.getHTML()
      };
    } else {
      // this.scrollToBottomSoftly(2000);
      data.result = this.evaluate(methods[0].method);
      if (!data.result) {
        data.error = {
          message: 'Scraper get nothing.',
          url: casper.getCurrentUrl(),
          html: casper.getHTML()
        }
      }
    }
  });

  casper.then(function () {
    this.echo(JSON.stringify(data));
    data = {};
  });

  // casper.nextOrExit(tools.nextSelector, scrapePage);
};


casper.userAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.143 Safari/537.36');

casper.start(tools.homeUrl);
casper.thenOpen(url);
scrapePage();
casper.run();
