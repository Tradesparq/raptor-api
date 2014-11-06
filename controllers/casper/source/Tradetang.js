module.exports = {
  homeUrl: 'http://www.tradetang.com',
  searchUrl: 'http://www.tradetang.com/wholesale/',
  nextSelector: 'div.list_item4-2>span.listnext>a',
  expend: function (casper) {
    casper.init = function () {
      this.then(function () {
        this.reopen(function () {
          casper.evaluate(function () {
            window.writedisplay('0');
          });
          casper.thenOpen(url, function () {
            casper.reopen();
          });
        });
      });
    };
    return casper;
  },
  scrapers: [
    { condition: function () { return document.querySelector('li.listpro3')? true: false; },
      method: function () {
        var items = document.querySelectorAll('li.listpro3');
          return Array.prototype.map.call(items, function(element) {
            return {
              product_id: element.querySelector('p.pro-title a').getAttribute('href').substring(element.querySelector('p.pro-title a').getAttribute('href').lastIndexOf('-') + 1, element.querySelector('p.pro-title a').getAttribute('href').lastIndexOf('.')),
              product_name: element.querySelector('p.pro-title a').innerHTML,
              product_url: 'http://www.tradetang.com' + element.querySelector('p.pro-title a').getAttribute('href'),
              product_image_url: element.querySelector('div.list-img img').getAttribute("src"),
              product_price_value: element.querySelector('p.list-price').innerHTML.replace(/<br>|\n/g, '').trim(),
              seller_id: element.querySelector('div.list-detail>p.list-detail4>a>img').getAttribute('sellerid'),
              seller_name: element.querySelector('p.list-detail3 a').innerHTML,
              seller_url: 'http://www.tradetang.com' + element.querySelector('p.list-detail3 a').getAttribute('href'),
              seller_gold_supplier: element.querySelector('div.list-detail>p.list-detail3>img[title="Gold Supplier"]')? true: false,
              source: 'Tradetang'
            };
        });
      }
    }
  ]
};
