chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ enabled: true });
});

const options = { 
  urls: ["*://*.reddit.com/*"], 
  types: ["main_frame"] 
};

const action = async ({ url }) => {
  const { enabled } = await new Promise(resolve =>
    chrome.storage.local.get('enabled', resolve)
  );

  if (!enabled) {
    return {};
  }

  const u = new URL(url);
  if (u.searchParams.has("tl")) {
    u.searchParams.delete("tl");
    return { redirectUrl: u.toString() };
  }
  return {};
};

chrome.webRequest.onBeforeRequest.addListener(action, options, ["blocking"]);