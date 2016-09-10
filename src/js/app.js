requirejs.config({
    baseUrl: '../src/js/app',
    paths: {
        main: 'menu/main',
        removeItem: 'menu/removeItem',
        createMenu: 'menu/createMenu',
        eventListeners: 'menu/eventListeners',
        storeData: 'storeData',
        helpers: 'helpers',
    }
});
requirejs(['main']);