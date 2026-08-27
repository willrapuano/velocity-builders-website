(() => {
  "use strict";

  const blockedDisplay =
    /bright[\s_-]*mls|brightmls|\bidx\b|0a2cacda999999cdec3d43150dbf59a151e702b9/i;
  const candidateSelector = [
    "img",
    "picture",
    "source",
    "iframe",
    "object",
    "embed",
    "svg",
    '[role="img"]',
    "[src]",
    "[srcset]",
    "[href]",
    "[data-src]",
    "[data-srcset]",
    "[alt]",
    "[title]",
    "[aria-label]",
    "[class]",
    "[id]",
    "[style]",
  ].join(",");
  const inspectedAttributes = [
    "src",
    "srcset",
    "href",
    "data-src",
    "data-srcset",
    "alt",
    "title",
    "aria-label",
    "class",
    "id",
    "style",
  ];
  const shadowRoots = new WeakMap();
  let scanScheduled = false;

  function isBottomRightOverlay(element) {
    if (
      element === document.documentElement ||
      element === document.head ||
      element === document.body
    ) {
      return false;
    }

    const style = window.getComputedStyle(element);
    if (style.position !== "fixed" || style.display === "none") return false;

    const rect = element.getBoundingClientRect();
    const widthLimit = Math.min(480, window.innerWidth * 0.9);
    const heightLimit = Math.min(480, window.innerHeight * 0.9);
    const reachesRightEdge = rect.right >= window.innerWidth - 96;
    const reachesBottomEdge = rect.bottom >= window.innerHeight - 96;
    const startsInRightRegion = rect.left >= window.innerWidth * 0.35;
    const startsInBottomRegion = rect.top >= window.innerHeight * 0.35;

    return (
      rect.width > 0 &&
      rect.height > 0 &&
      rect.width <= widthLimit &&
      rect.height <= heightLimit &&
      reachesRightEdge &&
      reachesBottomEdge &&
      startsInRightRegion &&
      startsInBottomRegion
    );
  }

  function displaySignature(element) {
    return inspectedAttributes
      .map((attribute) => element.getAttribute(attribute) || "")
      .join(" ");
  }

  function blocksPublicDisplay(element) {
    if (blockedDisplay.test(displaySignature(element))) return true;
    if (isBottomRightOverlay(element)) return true;

    if (element.matches("svg, [role=img]")) {
      return blockedDisplay.test(element.textContent || "");
    }

    return false;
  }

  function quarantine(element) {
    if (
      element === document.documentElement ||
      element === document.head ||
      element === document.body
    ) {
      return;
    }

    element.setAttribute("data-rebuilder-mls-display-blocked", "true");
    element.remove();
  }

  function inspect(element) {
    if (element.matches(candidateSelector) && blocksPublicDisplay(element)) {
      quarantine(element);
      return;
    }

    for (const candidate of element.querySelectorAll(candidateSelector)) {
      if (blocksPublicDisplay(candidate)) quarantine(candidate);
    }

    const ownedShadowRoot = shadowRoots.get(element) || element.shadowRoot;
    if (ownedShadowRoot) inspectRoot(ownedShadowRoot);
  }

  function inspectRoot(root) {
    for (const element of root.querySelectorAll("*")) {
      if (blocksPublicDisplay(element)) {
        quarantine(element);
        continue;
      }

      const ownedShadowRoot = shadowRoots.get(element) || element.shadowRoot;
      if (ownedShadowRoot) inspectRoot(ownedShadowRoot);
    }
  }

  function inspectDocument() {
    inspect(document.documentElement);
    inspectRoot(document);
  }

  function scheduleScan() {
    if (scanScheduled) return;
    scanScheduled = true;
    requestAnimationFrame(() => {
      scanScheduled = false;
      inspectDocument();
    });
  }

  const observer = new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === "attributes") {
        inspect(record.target);
        continue;
      }

      for (const node of record.addedNodes) {
        if (node instanceof Element) inspect(node);
      }
    }

    scheduleScan();
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: inspectedAttributes,
    childList: true,
    subtree: true,
  });

  const originalAttachShadow = Element.prototype.attachShadow;
  Element.prototype.attachShadow = function attachShadow(init) {
    const root = originalAttachShadow.call(this, init);
    shadowRoots.set(this, root);
    observer.observe(root, {
      attributes: true,
      attributeFilter: inspectedAttributes,
      childList: true,
      subtree: true,
    });
    scheduleScan();
    return root;
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleScan, {
      once: true,
    });
  } else {
    scheduleScan();
  }

  window.addEventListener("load", scheduleScan, { once: true });
  window.addEventListener("resize", scheduleScan, { passive: true });
  for (const delay of [250, 1000, 3000, 10000]) {
    window.setTimeout(scheduleScan, delay);
  }
})();
