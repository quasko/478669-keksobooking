'use strict';

(function () {
  window.createErrorMessage = function (text) {
    var node = document.createElement('div');
    var closeNode = document.createElement('button');
    node.classList.add('error');
    node.textContent = text;
    closeNode.type = 'button';
    closeNode.classList.add('error__close');
    node.appendChild(closeNode);
    closeNode.addEventListener('click', function () {
      node.remove();
    });
    return node;
  };
})();
