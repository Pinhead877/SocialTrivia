var errors = {};

// errors.EMPTY = { error: {code: 0000, message: "Error message"} };

errors.UNKNOWN = {error: {code: 0001, message: "Unknown error occurred"} };
errors.DB_CONNECT_ERROR = {error: {code: 1000, message: "Error connecting to database"} };
errors.DB_OPERATION = { error: {code: 1001, message: "Database operation error"} };
errors.USER_EXISTS = {error: {code: 1010, message: "Username already exists"} };
errors.NO_SESSION = {error: {code: 1011, message: "No session found, please login"} };
errors.BAD_LOGIN = {error: {code: 1012, message: "Incorrect Username or Password"} };
errors.BAD_QUE = {error: {code: 1013, message: "Please check your question"} };
errors.BAD_ANS = {error: {code: 1014, message: "Please check your answer"} };
errors.DEV_ERROR = {error: {code: 1111, message: "Dev - Change needed!"} };
errors.NO_QUES = {error: {code: 2001, message: "Cant create a game without questions"} };
errors.GAME_NUM_ERROR = {error: {code: 2002, message: "The game number you entered doesnt exists!"} };
errors.CREATOR_IS_PLAYER = {error: {code: 2004, message: "You cant enter a game you created as a player"} };
errors.NO_PLAYERS = {error: {code: 2005, message: "You need atleast 2 players to start a game"} };
errors.GAME_ENDED = { error: {code: 2010, message: "Game Ended!"} };
errors.QUE_ANSWERED = { error: {code: 3001, message: "Question already answered"} };
errors.QUE_TRIED = { error: {code: 3002, message: "You've already tried to answer this question"} };

module.exports =  errors;
