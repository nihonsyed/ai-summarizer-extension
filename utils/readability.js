
(function () {
  window.Readability = Readability;
  window.extractMainContent = function () {
    try {
      const docClone = document.cloneNode(true);
      const reader = new Readability(docClone);
      const article = reader.parse();
      return article ? article.textContent : document.body.innerText;
    } catch (e) {
      console.warn("Readability failed:", e);
      return document.body.innerText;
    }
  };
})();
