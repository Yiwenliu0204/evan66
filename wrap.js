// 中文斷行：把內文切成詞，讓換行只發生在詞與詞之間，不會把「大學生」斷成「大／學生」。
(function () {
  if (!('Segmenter' in Intl)) return;
  var seg = new Intl.Segmenter('zh-Hant', { granularity: 'word' });
  var cjk = /[㐀-鿿]/;
  var targets = document.querySelectorAll('main p, main li, figcaption');
  targets.forEach(function (el) {
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      var text = node.data;
      if (!cjk.test(text) || node.parentNode.closest('.nw, .nowrap')) return;
      var frag = document.createDocumentFragment();
      var parts = Array.from(seg.segment(text));
      for (var i = 0; i < parts.length; i++) {
        var s = parts[i].segment;
        // 標點黏在前一個詞後面，避免行首出現逗號或句號
        while (i + 1 < parts.length && !parts[i + 1].isWordLike && /^[，。、：；！？」』）%]+$/.test(parts[i + 1].segment)) {
          s += parts[++i].segment;
        }
        if (/^\s+$/.test(s)) { frag.appendChild(document.createTextNode(s)); continue; }
        var span = document.createElement('span');
        span.className = 'w';
        span.textContent = s;
        frag.appendChild(span);
      }
      node.parentNode.replaceChild(frag, node);
    });
  });
})();
