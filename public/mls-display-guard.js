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

  function displaySignature(element) {
    return inspectedAttributes
      .map((attribute) => element.getAttribute(attribute) || "")
      .join(" ");
  }

  function blocksPublicDisplay(element) {
    if (blockedDisplay.test(displaySignature(element))) return true;

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
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: inspectedAttributes,
    childList: true,
    subtree: true,
  });

  const inspectDocument = () => inspect(document.documentElement);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inspectDocument, {
      once: true,
    });
  } else {
    inspectDocument();
  }
})();
