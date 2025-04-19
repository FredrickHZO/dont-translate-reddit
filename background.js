chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      const url = new URL(details.url);
  
      if (url.searchParams.has("tl")) {
        url.searchParams.delete("tl");
        return { redirectUrl: url.toString() };
      }
  
      return {};
    },
    
    { urls: ["*://*.reddit.com/*"], types: ["main_frame"] },
    ["blocking"]
  );
  