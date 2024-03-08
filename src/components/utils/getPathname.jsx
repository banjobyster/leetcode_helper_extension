const getPathNameArray = () => {
    return new Promise((resolve, reject) => {
        browser.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
            if (tabs && tabs.length > 0) {
                const url = new URL(tabs[0].url);
                if (!url.hostname.includes("leetcode")) {
                    reject("Use the extension in leetcode only!");
                    return;
                }
                const pathname = url.pathname;
                const pathnameArray = pathname.split('/').filter(Boolean);
                resolve(pathnameArray);
            } else {
                reject("Tabs not found!");
            }
        });
    });
};

export { getPathNameArray };