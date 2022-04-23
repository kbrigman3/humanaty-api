var farmers = require('../controllers/farmers-controller');

module.exports = function (app) {
    app.get('/farmer/:id',
        farmers.getFarmerById
    );

    app.get('/farmers',
        farmers.getFarmersByCriteria
    );
    app.get('/farmlist',
        farmers.getFarmersList
    );
};