requirejs.config({
    baseUrl: '../src/js/app',
    paths: {
        d3: '../lib/d3.v3.min',
        menu: 'menu/main',
        removeItem: 'menu/removeItem',
        createMenu: 'menu/createMenu',
        eventListeners: 'menu/eventListeners',
        helpers: 'helpers',
        presentData: 'presentData/main',
        goodBadGraph: 'presentData/graphs/goodBadGraph',
        individualWebsiteGraph: 'presentData/graphs/individualWebsiteGraph',
        mainBarChart: 'presentData/graphs/mainBarChart',
        insightsChart: 'presentData/graphs/insightsChart',
        graphsEventListeners: 'presentData/eventListeners'
    }
});
requirejs(['d3','menu','presentData']);