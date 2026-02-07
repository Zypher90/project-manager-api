let verificationMail = (username, verificationUrl) => {
    return {
        body: {
            name: username,
            intro: "Welcome onboard! We are thrilled to have you here.",
            action: {
                instructions: "To get verified, please click here: ",
                button: {
                    color: '#00BCA1',
                    text: "Verify account",
                    link: verificationUrl,
                }
            },
            outro: "Need help? Reply to this email with your query, we're happy to help!"
        }
    }
}

let forgotPasswordMail = (username, forgotPasswordUrl) => {
    return {
        body: {
            name: username,
            intro: "We received a request to reset your password",
            action: {
                instructions: "To reset your password, click on the following: ",
                button: {
                    color: '#00BCA1',
                    text: "Reset Password",
                    link: forgotPasswordUrl,
                }
            },
            outro: "Need help? Reply to this email with your query, we're happy to help!"
        }
    }
}

export { verificationMail, forgotPasswordMail };