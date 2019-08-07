const jwt   = require("jsonwebtoken");

module.exports = {
    getToken : (tokenPayload) => {
        const tokenSecret = "backend-test" 
        const tokenOptions = {
            expiresIn : "1h"
        }
        const token = jwt.sign(tokenPayload, tokenSecret, tokenOptions);
        return token;
    },

    verifyToken :(token, callback) => {
        try {
            const decoded = jwt.verify(token, "backend-test");
            callback("valid");
        } catch (error) {
            callback(error.message);
        }
    },

    verifyTokenById : (token, id, callback) => {
        try {
            const decoded = jwt.verify(token, "backend-test");
            if(decoded.id == id) {
                callback("valid");
            } else {
                callback("invalid request / not found");
            }
        } catch (error) {
            callback(error.message);
        }
    }
}