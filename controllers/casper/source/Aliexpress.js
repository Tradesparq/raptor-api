module.exports = {
  homeUrl: 'http://www.aliexpress.com',
  searchUrl: 'http://www.aliexpress.com/wholesale?SearchText=',
  nextSelector: 'div#pagination-bottom a.page-next',
  expend: function (casper) {
    casper.init = function () {
      this.then(function () {
        this.log('init', 'debug');
        if (this.getCurrentUrl().indexOf('g=n') < 0) {
          if (this.getCurrentUrl().indexOf('?') < 0) {
            this.open(this.getCurrentUrl() + '?g=n');
          } else {
            this.open(this.getCurrentUrl() + '&g=n');
          }
        }
      });
    };
    return casper;
  },
  scrapers: [
    { condition: function () { return document.querySelector('li.list-item-180')? true: false; },
      method: function () {
        var items = document.querySelectorAll('li.list-item');
          return Array.prototype.map.call(items, function(element) {
            return {
              product_id: element.querySelector('input.atc-product-id').getAttribute('value'),
              product_image_url: getImg(element),
              product_name: element.querySelector('h3 a.product').getAttribute("title"),
              product_rate: element.querySelector('span.rate-percent')? element.querySelector('span.rate-percent').style.width: null,
              product_url: element.querySelector('h3 a.product').getAttribute("href"),
              product_price_value:element.querySelector('div.infoprice span.value').innerHTML,
              seller_id: element.querySelector('div.detail a.store').getAttribute('href').substring(element.querySelector('div.detail a.store').getAttribute('href').lastIndexOf('/') + 1, element.querySelector('div.detail a.store').getAttribute('href').length),
              seller_name: element.querySelector('div.detail a.store').innerHTML,
              seller_seller_positive_feedback_percentage: element.querySelector('div.detail a.score-dot')? element.querySelector('div.detail a.score-dot>img').getAttribute('sellerpositivefeedbackpercentage'): null,
              seller_url: element.querySelector('div.detail a.store').getAttribute('href'),
              source: 'Aliexpress'
            }
        });
        function getImg(element) {
          if(element.querySelector('div.img img.picCore').getAttribute("src")==null) {
            return element.querySelector('div.img img.picCore').getAttribute("image-src")
          } else {
            return element.querySelector('div.img img.picCore').getAttribute("src")
          }
        }
      }
    }
  ]
};
