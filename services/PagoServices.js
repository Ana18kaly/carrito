const axios = require("axios");

const configData = require("../configData.json");
const card = require("../Dataaa/card.json");
const PagoException = require("../exceptions/PagoException");

class PagoService {
    constructor(user) {
        if (!user || !user.bearerToken || !user.customerId || !user.storeId) {
            throw new PagoException("El servicio de pago no está correctamente inicializado.");
        }
        this.user = user;
    }

    async addPayment(basketId) {
        try {
            const config = {
                method: "post",
                url: configData.apiUrls.addPayment,
                params: { basketId },
                headers: {
                    "Ocp-Apim-Subscription-Key": configData.subscriptionKey,
                    "Content-Type": "application/json",
                    Authorization: this.user.bearerToken,
                },
                data: card,
            };
            const response = await axios(config);
            return response.data;
        } catch (error) {
            throw new PagoException("Error al agregar la tarjeta: " + error.message);
        }
    }
}

module.exports = PagoService;
