(function () {
  var messagePrefix = "artilis-builder:";
  var allowedParentOrigins = ["https://artilis.fr", "https://www.artilis.fr"];
  var isLocalDevelopment = ["localhost", "127.0.0.1"].indexOf(location.hostname) !== -1;
  var injectedStyle =
    "[data-builder-block] { cursor: pointer; }" +
    "[data-builder-block]::before { content: attr(data-builder-tag); position: absolute; z-index: 3000; top: 12px; left: 12px; background: #181715; color: #fff; padding: 4px 14px; font: 700 22px/1.2 Barlow, sans-serif; opacity: 0; pointer-events: none; }" +
    '[data-builder-block="banner"]::before { top: 130px; }' +
    "[data-builder-block].is-todo::before { opacity: 1; background: #bfb21a; color: #181715; }" +
    "[data-builder-block]:hover { outline: 6px solid #181715; outline-offset: -6px; }" +
    "[data-builder-block]:hover::before { opacity: 1; background: #181715; color: #fff; }" +
    "[data-builder-block].is-active { outline: 8px solid #bfb21a; outline-offset: -8px; }" +
    ".banner-inner[data-builder-block], .banner-inner[data-builder-block]:hover { outline: none; }" +
    ".banner-inner[data-builder-block]::before { display: none; }";

  var blocks = [];
  var activeBlockId = null;
  var lastScrolledBlockId = null;

  function isAllowedOrigin(origin) {
    return (
      origin === location.origin ||
      allowedParentOrigins.indexOf(origin) !== -1 ||
      (isLocalDevelopment && /^http:\/\/localhost:\d+$/.test(origin))
    );
  }

  function post(message) {
    window.parent.postMessage(Object.assign({ source: "artilis-builder-bridge" }, message), "*");
  }

  function injectStyle() {
    if (document.getElementById("artilis-builder-style")) return;
    var style = document.createElement("style");
    style.id = "artilis-builder-style";
    style.textContent = injectedStyle;
    document.head.appendChild(style);
  }

  function applyBlocks() {
    blocks.forEach(function (block) {
      var elements = [];
      try {
        elements = document.querySelectorAll(block.selector);
      } catch (error) {
        return;
      }
      elements.forEach(function (element) {
        element.dataset.builderBlock = block.id;
        element.dataset.builderTag = (block.isTodo ? "À compléter : " : "Modifier : ") + block.label;
        if (window.getComputedStyle(element).position === "static") {
          element.style.position = "relative";
        }
        element.classList.toggle("is-todo", Boolean(block.isTodo));
        element.classList.toggle("is-active", block.id === activeBlockId);
      });
    });

    var activeBlock = blocks.filter(function (block) {
      return block.id === activeBlockId;
    })[0];
    if (!activeBlock) lastScrolledBlockId = null;
    var activeElement = activeBlock && document.querySelector(activeBlock.selector);
    if (activeElement && lastScrolledBlockId !== activeBlockId) {
      lastScrolledBlockId = activeBlockId;
      window.scrollTo({
        top: activeElement.getBoundingClientRect().top + window.scrollY - 120,
        behavior: "smooth",
      });
    }
  }

  window.addEventListener("message", function (event) {
    if (event.source !== window.parent || !isAllowedOrigin(event.origin)) return;
    var message = event.data;
    if (!message || typeof message.type !== "string" || message.type.indexOf(messagePrefix) !== 0) {
      return;
    }
    if (message.type === messagePrefix + "init") {
      blocks = Array.isArray(message.blocks) ? message.blocks : [];
      activeBlockId = message.activeBlockId || null;
      injectStyle();
      applyBlocks();
    }
    if (message.type === messagePrefix + "reload") {
      location.reload();
    }
  });

  document.addEventListener(
    "click",
    function (event) {
      if (!blocks.length) return;
      event.preventDefault();
      event.stopPropagation();
      var block = event.target.closest && event.target.closest("[data-builder-block]");
      if (block) post({ type: messagePrefix + "pick", blockId: block.dataset.builderBlock });
    },
    true
  );

  post({ type: messagePrefix + "ready" });
})();
