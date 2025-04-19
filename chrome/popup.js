const checkbox = document.getElementById('toggle');

chrome.storage.local.get('enabled', ({ enabled }) => {
    checkbox.checked = enabled ?? true;
});

checkbox.addEventListener('change', () => {
    chrome.storage.local.set({ enabled: checkbox.checked });
});