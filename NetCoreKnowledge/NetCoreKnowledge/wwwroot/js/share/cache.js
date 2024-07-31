
(function (define) {
    define(function (require) {
        var HiloStore = {
            createKey: function (key) {
                return HiloStringUtils.md5(`${key}`);
            },
            createObject: function (key, value, ttl) {
                return {
                    create: Date.now(),
                    //keyOrigin: key,
                    key: HiloStore.createKey(key),
                    ttl: Date.now() + ttl * 1000,
                    value: value
                };
            },
            getDbName: (storename) => `${storename}-database`,
            getStoreName: (storename) => `${storename}-store`,
            openDB: (storename) => new Promise((resolve, reject) => {
                const request = window.indexedDB.open(HiloStore.getDbName(storename), 1);
                request.onupgradeneeded = function (event) {
                    const db = event.target.result;
                    const objectStore = db.createObjectStore(HiloStore.getStoreName(storename));
                };
                request.onsuccess = function (event) {
                    resolve(event.target.result);
                };
            }),
            openTransactionDB: (db, storename) => new Promise((resolve, reject) => {
                const transaction = db.transaction([HiloStore.getStoreName(storename)], "readwrite");
                const objectStore = transaction.objectStore(HiloStore.getStoreName(storename));
                resolve({ db: db, transaction: transaction, objectStore: objectStore });
            }),
            setDB: (storename, key, value, ttl) => new Promise((resolve, reject) => {
                return HiloStore.clearDB(storename)
                    .then(db => {
                        const obj = HiloStore.createObject(key, value, ttl);
                        const objectStoreRequest = db.objectStore.put(obj, obj.key);
                        objectStoreRequest.onerror = function (event) {
                            resolve(null);
                        };

                        objectStoreRequest.onsuccess = function (event) {
                            resolve(objectStoreRequest.result);
                        };

                        db.transaction.oncomplete = function (event) {
                            db.db.close();
                        };
                    })

            }),
            getDB: (storename, key) => new Promise((resolve, reject) => {
                return HiloStore.clearDB(storename).then(db => {
                    const requestGet = db.objectStore.get(HiloStore.createKey(key));
                    requestGet.onerror = function (event) {
                        resolve(null);
                    };
                    requestGet.onsuccess = function (event) {
                        resolve(requestGet.result?.value);
                    };
                    db.transaction.oncomplete = function (event) {
                        db.db.close();
                    };
                })
            }),
            removeDB: (storename, key) => new Promise((resolve, reject) => {
                return HiloStore.clearDB(storename).then(db => {
                    const deleteRequest = db.objectStore.delete(HiloStore.createKey(key));
                    deleteRequest.onerror = function (event) {
                        resolve(null);
                    };
                    deleteRequest.onsuccess = function (event) {
                        resolve(null);
                    };

                    // Đóng kết nối cơ sở dữ liệu
                    db.transaction.oncomplete = function () {
                        db.db.close();
                    };
                });
            }),
            clearDB: (storename) => new Promise((resolve, reject) => {
                return HiloStore.openDB(storename).then(db => HiloStore.openTransactionDB(db, storename)).then(db => {
                    const getAllRequest = db.objectStore.getAll();
                    getAllRequest.onerror = function (event) {
                        resolve(null);
                    };
                    getAllRequest.onsuccess = function (event) {
                        const items = event.target.result;
                        const currentTime = Date.now();
                        // Xóa các mục có thời gian sống hết hạn
                        items.forEach(item => {
                            if (item.ttl && Date.now() > item.ttl) {
                                db.objectStore.delete(item.key);
                            }
                        });
                        resolve(db);
                    };
                    db.transaction.oncomplete = function () {
                        db.db.close();
                    };
                });
            }),
            truncateDb: (storename) => new Promise((resolve, reject) => {
                return HiloStore.openDB(storename).then(db => HiloStore.openTransactionDB(db, storename)).then(db => {
                    const getAllRequest = db.objectStore.getAll();
                    getAllRequest.onerror = function (event) {
                        resolve(null);
                    };
                    getAllRequest.onsuccess = function (event) {
                        const items = event.target.result;
                        items.forEach(item => {
                            db.objectStore.delete(item.key);
                        });
                        resolve(db);
                    };
                    db.transaction.oncomplete = function () {
                        db.db.close();
                    };
                });
            }),
            insertIndexedDB: (key, value, ttl, storename = "HILO-INVOICE-CACHE") => HiloStore.setDB(storename, key, value, ttl),
            selectIndexedDB: (key, storename = "HILO-INVOICE-CACHE") => HiloStore.getDB(storename, key),
            deleteIndexedDB: (key, storename = "HILO-INVOICE-CACHE") => HiloStore.removeDB(storename, key),
            truncateIndexedDB: (storename = "HILO-INVOICE-CACHE") => HiloStore.truncateDb(storename)
        };

        return HiloStore;
    });
})(typeof define === 'function' && define.amd ? define : function (factory) {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory(require('jquery'));
    } else {
        window.HiloStore = factory(window.jQuery);
    }
});