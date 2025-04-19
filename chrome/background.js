const enableAddon = () => {
  chrome.storage.local.get('enabled', (data) => {
    const isEnabled = data.enabled ?? true;
    chrome.storage.local.set({ enabled: isEnabled });

    chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: isEnabled ? ['removeTlParam'] : [],
      disableRulesetIds: isEnabled ? [] : ['removeTlParam']
    });
  });
}

chrome.runtime.onInstalled.addListener(() => enableAddon());

const updateEnabledRuleset = (ruleSetValue) => {
  chrome.declarativeNetRequest.updateEnabledRulesets({
    enableRulesetIds: ruleSetValue ? ['removeTlParam'] : [],
    disableRulesetIds: ruleSetValue ? [] : ['removeTlParam']
  });
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (!changes.enabled || area !== 'local') {
    return;
  }

  const ruleSetValue = changes.enabled.newValue;
  updateEnabledRuleset(ruleSetValue);
});
