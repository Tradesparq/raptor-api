module.exports = {
  homeUrl: 'http://www.dhgate.com',
  searchUrl: 'http://www.dhgate.com/wholesale/search.do?searchkey=',
  nextSelector: 'div.page>a.next',
  expend: function (casper) {
    casper.init = function () {
      this.then(function () {
        this.log('init', 'debug');
        if (this.getCurrentUrl().indexOf('viewtype=1') < 0) {
          if (this.getCurrentUrl().indexOf('?') < 0) {
            this.open(this.getCurrentUrl() + '?viewtype=1');
          } else {
            this.open(this.getCurrentUrl() + '&viewtype=1');
          }
        }
      });
    };
    return casper;
  },
  scrapers: [
    { condition: function () { return document.querySelector('div.listitem') && document.querySelector('div.pro-seller a')? true: false; },
      method: function () {
        var items = document.querySelectorAll('div.listitem');
          return Array.prototype.map.call(items, function(element) {
            return {
              product_id: element.querySelector('div.photo>a.pic').getAttribute('itemcode'),
              seller_id: element.querySelector('div.pro-seller a').getAttribute('href').substring(element.querySelector('div.pro-seller a').getAttribute('href').lastIndexOf('/') + 1, element.querySelector('div.pro-seller a').getAttribute('href').length),
              product_name: element.querySelector('h3.pro-title a.subject').innerHTML,
              product_url: element.querySelector('div.photo>a.pic').getAttribute('href'),
              product_image_url: element.querySelector('div.photo>a.pic>img')? element.querySelector('div.photo>a.pic>img').getAttribute("src"): element.querySelector('div.photo>a.pic').getAttribute("lazyload-src"),
              product_rate: element.querySelector('div.list-pro>div.pro-sold>span.feedback>span')? element.querySelector('div.list-pro>div.pro-sold>span.feedback>span').innerText: null,
              product_price_value: element.querySelector('li.price').innerText,
              seller_id: element.querySelector('div.pro-seller a').getAttribute('href').substring(element.querySelector('div.pro-seller a').getAttribute('href').lastIndexOf('/') + 1, element.querySelector('div.pro-seller a').getAttribute('href').length),
              seller_name: element.querySelector('div.pro-seller a').innerHTML,
              seller_url: element.querySelector('div.pro-seller a').getAttribute('href'),
              source: 'Dhgate'
            };
        });

      }
    },
    { condition: function () { return document.querySelector('div.listitem') && document.querySelector('div.secattr li.pro-seller a')? true: false; },
      method: function () {
        var items = document.querySelectorAll('div.listitem');
          return Array.prototype.map.call(items, function(element) {
            return {

              product_id: element.querySelector('div.photo>a.pic').getAttribute('itemcode'),
              seller_id: element.querySelector('div.secattr li.pro-seller a').getAttribute('href').substring(element.querySelector('div.secattr li.pro-seller a').getAttribute('href').lastIndexOf('/') + 1, element.querySelector('div.secattr li.pro-seller a').getAttribute('href').length),
              product_name: element.querySelector('h3.pro-title a.subject').innerHTML,
              product_url: element.querySelector('div.photo>a.pic').getAttribute('href'),
              product_image_url: element.querySelector('div.photo>a.pic>img')? element.querySelector('div.photo>a.pic>img').getAttribute("src"): element.querySelector('div.photo>a.pic').getAttribute("lazyload-src"),
              product_rate: element.querySelector('div.list-pro span.feedback')? element.querySelector('div.list-pro span.feedback').innerText.replace(/[\(\)]/g, ''): null,
              product_price_value: element.querySelector('li.price').innerText,

              seller_id: element.querySelector('div.secattr li.pro-seller a').getAttribute('href').substring(element.querySelector('div.secattr li.pro-seller a').getAttribute('href').lastIndexOf('/') + 1, element.querySelector('div.secattr li.pro-seller a').getAttribute('href').length),
              seller_name: element.querySelector('div.secattr li.pro-seller a').innerHTML,
              seller_url: element.querySelector('div.secattr li.pro-seller a').getAttribute('href'),

              source: 'Dhgate'
            };
        });
      }
    }
  ]
};
