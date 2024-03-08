/* Local Storage Utility Functions */
const setStorage = async (dataObject) => {
    await browser.storage.local.set(dataObject);
};

const getStorage = async () => {
    return new Promise((resolve) => {
        browser.storage.local.get(null, (storageResult) => {
            resolve(storageResult);
        });
    });
};

const unsetStorage = async (...keys) => {
    await browser.storage.local.remove(keys);
};

export { setStorage, getStorage, unsetStorage }