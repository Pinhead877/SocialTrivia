var errors = {};

// errors.EMPTY = { error: {code: 0000, message: "Error message"} };

errors.DEV_ERROR = {error: {code: 0000, message: "Dev - Change needed!"} };
errors.UNKNOWN = {error: {code: 0001, message: "Unknown error occurred"} };

errors.DB_CONNECT_ERROR = {error: {code: 1000, message: "Error connecting to database"} };
errors.DB_OPERATION = { error: {code: 1001, message: "Database operation error"} };

errors.PASSWORD = {error: {code: 1008, message: "Password is required and must be between 4 and 10 letters or numbers"} };
errors.NICKNAME = {error: {code: 1009, message: "Nickname can only contain letters or numbers without spaces"} };
errors.USER_EXISTS = {error: {code: 1010, message: "Username already exists"} };
errors.NO_SESSION = {error: {code: 1011, message: "No session found, please login"} };
errors.BAD_LOGIN = {error: {code: 1012, message: "Incorrect Username or Password"} };
errors.BAD_QUE = {error: {code: 1013, message: "Please check your question"} };
errors.BAD_ANS = {error: {code: 1014, message: "Please check your answer"} };
errors.NO_CATEGORY = { error: {code: 1015, message: "Please choose a category"} };
errors.WORD_LENGTH = { error: {code: 1016, message: "Word length cannot exceed 7 letters"} };

errors.NO_GAME_NAME = {error: {code: 2000, message: "Cant create a game without a name"} };
errors.NO_QUES = {error: {code: 2001, message: "Cant create a game without questions"} };
errors.GAME_NUM_ERROR = {error: {code: 2002, message: "The game number you entered doesnt exists!"} };
errors.USER_EXISTS_IN_GAME = { error: {code: 2003, message: "This user are already in this game"} };
errors.CREATOR_IS_PLAYER = {error: {code: 2004, message: "You cant enter a game you created as a player"} };
errors.NO_PLAYERS = {error: {code: 2005, message: "You need atleast 2 players to start a game"} };
errors.CREATING_GAME = { error: {code: 2006, message: "Error creating new Game.\nPlease try again later."} };
errors.GAME_ENDED = { error: {code: 2010, message: "Game Ended!"} };
errors.GAME_STARTED_WITH_PLAYER = { error: {code: 2011, message: "Game already started - you are one of the players"} };
errors.GAME_STARTED_NO_PLAYER = { error: {code: 2012, message: "Game already started - you can't join in the middle of the game"} };

errors.QUE_ANSWERED = { error: {code: 3001, message: "Question already answered"} };
errors.QUE_TRIED = { error: {code: 3002, message: "You've already tried to answer this question"} };
errors.QUE_NOT_EXISTS = { error: {code: 3003, message: "The Question you entered does not exists"} };
errors.QUE_OCCIPIED = { error: {code: 3004, message: "The Question you entered is being answered by other player"} };

module.exports =  errors;
