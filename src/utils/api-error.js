class ApiError extends Error {
    constructor(status, message = "Error occurred", errors = [], stack = "") {
        super(message);
        this.status = status;
        this.data = null;
        this.message = message;
        this.success = false;

        if(stack) {
            this.stack = stack;
        }else{
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;