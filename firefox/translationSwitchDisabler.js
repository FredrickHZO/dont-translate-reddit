const searchInShadowRoot = (selector) => {
      const queue = [document];

      while (queue.length) {
            const current = queue.shift();
            const element = current.querySelector(selector);
            if (element) {
                  return element;
            }

            const children = current.querySelectorAll('*');
            children.forEach(child => {
                  if (child.shadowRoot) {
                        queue.push(child.shadowRoot)
                  }
            });
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
      if (!enabled) {
            return;
      }
      turnOffSwitch();
});
    