var events = require('../controllers/reviews-controller');

module.exports = function (app) {

    app.post('/review/',
        events.createReview
    );

    /**
     * usage: /http://localhost:9000/review/exampleID123456
     * everything is Case Sentitive!
     */
    app.get('/review/:id',
        events.getReviewById
    );
};