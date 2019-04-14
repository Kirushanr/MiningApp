// Create a new error handling controller method
exports.getErrorMessage = (err) => {
	// Define the error message variable
	var message = '';
    console.log(err);
	// If an internal MongoDB error occurs get the error message
	if (err.code) {
		switch (err.code) {
			// If a unique index error occurs set the message error
			case 11000:
			case 11001:
				message = 'Assessment already exists';
				break;
			// If a general error occurs set the message error
			default:
				message = 'Internal server error';
		}
	}
	// Return the message error
	return message;
};