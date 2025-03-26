const axios = require("axios");
const AuthException = require("../exceptions/AuthException");
const configData = require("../configData.json");

class AuthService {
    static getBasicToken(email, password) {
        return "Basic " + Buffer.from(`${email}:${password}`).toString("base64");
    }

    static async login(email, password) {
        try {
            const authHeader = AuthService.getBasicToken(email, password);
            const config = {
                method: "get",
                url:  configData.apiUrls.login,
                headers: {
                    "Ocp-Apim-Subscription-Key": configData.subscriptionKey,
                    Authorization: authHeader,
                },
            };

            const response = await axios(config);
            
            if (!response.data || !response.headers["authorization"]) {
                throw new Error("No se recibieron los datos necesarios del API.");
            }

            return {
                bearerToken: response.headers["authorization"],
                customerId: response.data.customerId,
                email: response.data.email,
                storeId: response.data.c_tempStoreId,
            };
        } catch (error) {
            console.error("❌ Error en el login:", error.message);
            throw new AuthException(error.message);
        }
    }
}
module.exports = AuthService; 