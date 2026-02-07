class ApiResponse {
    constructor(status, body, message = "Success") {
        this.status = status;
        this.body = body;
        this.message = message;
        this.success = status < 400;
    }
}

export default ApiResponse;