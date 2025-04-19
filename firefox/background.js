let enabled = true;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ enabled: true });
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

const removeTranslation = (details) => {
  if (!enabled) {
    return {};
  } 
  
  const url = new URL(details.url);
  if (url.searchParams.has("tl")) {
    url.searchParams.delete("tl");
    return { redirectUrl: url.toString() };
  }
  return {};
}

chrome.webRequest.onBeforeRequest.addListener(removeTranslation, options, ["blocking"]);
