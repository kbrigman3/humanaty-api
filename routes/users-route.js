var users = require('../controllers/users-controller');

module.exports = function (app) {

  /**
   * get user by ID
   * example http://localhost:9000/user/08VUCOWnwRI7z74sar8o
   */
  app.get('/user/:id',
        users.getUserById
  );     

/**
 * get currently logged in user data
 */
  app.get('/current',
        users.getCurrentUser
  );     

/**
 * toggle current's user host/guest status
 */
  app.get('/changeStatus',
        users.changeUserStatus
  );     

/**
 * toggle current's user host/guest status
 */
  app.get('/logout',
        users.logOut
  );     
};
