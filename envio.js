const axios = require("axios");
const config = require("./config.json");

async function splitShipment(user) {
    console.log("llamando a envio");
    
    const SUBSCRIPTION_KEY = config.subscriptionKey; 
    if (!SUBSCRIPTION_KEY) {
        console.error("❌ Error: La clave de suscripción no está configurada.");
        return null;
    }
    const authHeader = user.bearerToken;
    const requestConfig = {
        method: "post",
        url: "https://apimanagementsoriana.azure-api.net/qa01carrito/v3/api/Checkout/SplitShipment",
        params: {
            customerId: user.customerId,
            
        },
        headers: {
            "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY,
            "Content-Type": "application/json",
            Authorization: authHeader,
        },
        data: shipmentData,
    };
    try {
        const response = await axios(requestConfig);
        
        // se imprime el total
        const total = response.data.total;
        console.log("Total del pedido después de dividir el envío: $", total);
        
        return total;
    } catch (error) {
        console.error("❌ Error en splitshipment:", error.message);
        return null;
    }    
}
module.exports = {splitShipment};