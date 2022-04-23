var events = require('../controllers/events-controller');

module.exports = function (app) {

    app.post('/event/',
        events.createEvent
    );

    /**
     * usage: /http://localhost:9000/event/exampleID123456
     * everything is Case Sentitive!
     */
    app.get('/event/:id',
        events.getEventById
    );

    /**
     * Get event list by city or title or hostId so far.
     * usage: /http://localhost:9000/events?city=Atlanta
     * everything is Case Sentitive!
     */
    app.get('/events',
        events.getEventsByCriteria
    );
};