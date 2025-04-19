const searchInShadowRoot = (selector, root = document) => {
      const queue = [root];

      while (queue.length) {
            const current = queue.shift();
            const element = current.querySelector(selector);
            if (element) {
                  return element;
            }

            const children = current.querySelectorAll('*');
            for (const child of children) {
                  if (child.shadowRoot) {
                        queue.push(child.shadowRoot);
                  }
            }
      }

      return null;
}

const turnOffSwitch = () => {
      const switchInput = searchInShadowRoot('#hui-translation-switch');

      if (switchInput) {
            switchInput.setAttribute('aria-checked', 'false');
            switchInput.removeAttribute('checked');
      }
}

chrome.storage.local.get("enabled", ({ enabled }) => {
      if (!enabled) return;
      turnOffSwitch();
});
    