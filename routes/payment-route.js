var payments = require('../controllers/payments-controller');

module.exports = function (app) {

    app.post('/test-payment',
        payments.createPayment
    );
};