var errors = {};

errors.DB_CONNECT_ERROR = {code: 1000, message: "Error connecting to database"};
errors.NO_SESSION = {code: 1007, message: "No session found, please login"};

module.exports =  errors;
