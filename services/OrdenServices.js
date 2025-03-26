const axios = require("axios");
const configData = require("../configData.json");
const validateSkData = require("../Dataaa/validateSkData.json");
const rateData = require("../Dataaa/rateData.json");
const orden = require("../Dataaa/orden.json");

const OrdenException = require("../exceptions/OrdenException");

class OrdenService {
    constructor(user) {
        if (!user || !user.bearerToken || !user.customerId || !user.storeId) {
            throw new OrdenException("El servicio de órdenes no está correctamente inicializado.");
        }
        this.user = user;
    }

    async validateStock() {
            const { bearerToken, customerId } = this.user;
    
            const config = {
                method: "post",
                url: configData.apiUrls.validateStock,
                params: { customerId },
                headers: {
                    "Ocp-Apim-Subscription-Key": configData.subscriptionKey,
                    "Content-Type": "application/json",
                    Authorization: bearerToken,
                },
                data: validateSkData,
            };
    
            try {
                await axios(config);
                console.log("✅ Stock validado.");
            } catch (error) {
                console.error("❌ Error en validateStock:", error.message);
            }
    }
    
        async rateTicket() {
            const { bearerToken, customerId } = this.user;
    
            const config = {
                method: "post",
                url: configData.apiUrls.rateTicket,
                params: { customerId },
                headers: {
                    "Ocp-Apim-Subscription-Key":  configData.subscriptionKey,
                    "Content-Type": "application/json",
                    Authorization: bearerToken,
                },
                data: rateData,
            };
    
            try {
                const response = await axios(config);
                console.log("✅ Ticket calificado correctamente.");
            } catch (error) {
                console.error("❌ Error en rateTicket:", error.message);
            }
    }
    
        async createOrder() {
        const authHeader = this.user.bearerToken;
        const config = {
            url: configData.apiUrls.createOrder,
            method: "post",
            params: {         
            },
            headers: {
                "Content-Type": "application/json",
                Authorization: authHeader, 
                "ocp-apim-subscription-key": configData.subscriptionKey,
                "version": configData.version,
                "dispositivo":  configData.dispositivo,
                "content-type": "application/json; charset=UTF-8"
            },
            data: orden
    
        };
        try {
            const response = await axios(config);
    
            if (response.data && response.data.orderNo) {
                console.log("✅ Número de orden:", response.data.orderNo);
                
                return response.data.orderNo;
            } else {
                console.warn("⚠️ Respuesta inesperada de la API:", response.data);
                console.log(JSON.stringify(response.data, null, 2));
                return null;
            }
        } catch (error) {
            console.error("❌ Error en createOrder:", error.message);
    
            if (error.response) {
                console.error("📌 Detalles del error:",  JSON.stringify(error.response.data, null, 2));
            }
    
            // para error por conexión y reintento
            if (error.code === 'ECONNRESET' && retries > 0) {
                console.log(`🔄 Reintentando... Intentos restantes: ${retries}`);
                await new Promise(resolve => setTimeout(resolve, 1000)); 
                return createOrder(user, retries - 1);
            }
    
            return null;
        }
    }
}

module.exports = OrdenService;
