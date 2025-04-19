let enabled = true;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ enabled: true });
  enabled = true;
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.enabled) {
    enabled = changes.enabled.newValue;
  }
});

const options = {
  urls: ["*://*.reddit.com/*"],
  types: ["main_frame"]
};

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (!enabled) return {};

    const u = new URL(details.url);
    if (u.searchParams.has("tl")) {
      u.searchParams.delete("tl");
      return { redirectUrl: u.toString() };
    }
    return {};
  },
  options,
  ["blocking"]
);
