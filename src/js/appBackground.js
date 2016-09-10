requirejs.config({
    baseUrl: '../src/js/app/collectData',
    paths: {
        helpers: '../helpers',
        chromeManageTabs: 'chromeManageTabs',
        mainCollectData: 'mainCollectData',
        notifications: 'notifications',
        registerEvents: 'registerEvents',
        timeOnWebsiteManager: 'timeOnWebsiteManager'
    }
});
requirejs(['mainCollectData']);