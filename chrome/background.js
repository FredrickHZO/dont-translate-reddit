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
        queue.push(child.shadowRoot);
      }
    });
  }

  return null;
};

const turnOffSwitch = () => {
  const switchInput = searchInShadowRoot('#hui-translation-switch');

  if (switchInput) {
    switchInput.setAttribute('aria-checked', 'false');
    switchInput.removeAttribute('checked');
  }
};

const enableAddon = () => {
  chrome.storage.local.get('enabled', (data) => {
    const isEnabled = data.enabled ?? true;
    chrome.storage.local.set({ enabled: isEnabled });

    chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: isEnabled ? ['removeTlParam'] : [],
      disableRulesetIds: isEnabled ? [] : ['removeTlParam']
    });
  });
};

const updateEnabledRuleset = (ruleSetValue) => {
  chrome.declarativeNetRequest.updateEnabledRulesets({
    enableRulesetIds: ruleSetValue ? ['removeTlParam'] : [],
    disableRulesetIds: ruleSetValue ? [] : ['removeTlParam']
  });
};

chrome.storage.onChanged.addListener((changes, area) => {
  if (!changes.enabled || area !== 'local') {
    return;
  }
  updateEnabledRuleset(changes.enabled.newValue);
});

chrome.runtime.onInstalled.addListener(() => enableAddon());

const executeTurnOffSwitch = (details) => {
  if (!details.url.includes("reddit.com")) {
    return;
  }

  chrome.storage.local.get('enabled', (data) => {
    if (!data.enabled) {
      return;
    }

    chrome.scripting.executeScript({
      target: { tabId: details.tabId },
      func: turnOffSwitch
    });
  });
}

chrome.webNavigation.onCompleted.addListener(details => executeTurnOffSwitch(details), { url: [{ hostContains: 'reddit.com' }] });
