const axios = require("axios");
const address = require('../Dataaa/address.json');
const shipmentData = require("../Dataaa/shipmentData.json");
const configData = require("../configData.json");
const EnvioException = require("../exceptions/EnvioException");

class EnvioService {
    constructor(user) {
        if (!user || !user.bearerToken || !user.customerId || !user.storeId) {
            throw new EnvioException("El servicio de envío no está correctamente inicializado.");
        }
        this.user = user;
    }

        async addAddress() {
        try {
            const config = {
                method: "post",
                url: configData.apiUrls.addAddress,
                params: { customerId: this.user.customerId },
                headers: {
                    "Ocp-Apim-Subscription-Key": configData.subscriptionKey,
                    "Content-Type": "application/json",
                    Authorization: this.user.bearerToken,
                },
                data: address,
            };
            const response = await axios(config);
            console.log("✅ Dirección agregada:", response.data.addressId);
        } catch (error) {
            throw new EnvioException("Error al agregar la dirección: " + error.message);
        }
    }

        async splitShipment() {
            const { bearerToken, customerId } = this.user;
    
            const config = {
                method: "post",
                url: configData.apiUrls.splitShipment,
                params: { customerId },
                headers: {
                    "Ocp-Apim-Subscription-Key": configData.subscriptionKey,
                    "Content-Type": "application/json",
                    Authorization: bearerToken,
                },
                data: shipmentData,
            };
    
            try {
                const response = await axios(config);
                console.log("✅ Envío dividido. Total: $", response.data.total);
            } catch (error) {
                console.error("❌ Error en splitShipment:", error.message);
            }
    }
}

module.exports = EnvioService;
