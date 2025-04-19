chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ enabled: true });
});

chrome.webRequest.onBeforeRequest.addListener(
  async ({ url }) => {
    const { enabled } = await new Promise(resolve =>
      chrome.storage.local.get('enabled', resolve)
    );

    if (!enabled) return {};

    const u = new URL(url);
    if (u.searchParams.has("tl")) {
      u.searchParams.delete("tl");
      return { redirectUrl: u.toString() };
    }
    return {};
  },
  
  { urls: ["*://*.reddit.com/*"], types: ["main_frame"] },
  ["blocking"]
);