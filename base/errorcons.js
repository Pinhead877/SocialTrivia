var errors = {};

errors.DB_CONNECT_ERROR = {code: 1000, message: "Error connecting to database"};
errors.USER_EXISTS = {code: 1010, message: "Username already exists"};
errors.NO_SESSION = {code: 1011, message: "No session found, please login"};
errors.BAD_LOGIN = {code: 1012, message: "Incorrect Username or Password"};
errors.BAD_QUE = {code: 1013, message: "Please check your question"};
errors.BAD_ANS = {code: 1014, message: "Please check your answer"};
errors.DEV_ERROR = {code: 1111, message: "Dev - Change needed!"};

module.exports =  errors;
