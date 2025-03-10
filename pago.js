const axios = require("axios");
const config = require("./config.json");

async function addPayment(user, basketId) {
    console.log("llamando card");

    const SUBSCRIPTION_KEY = config.subscriptionKey; 

    if (!SUBSCRIPTION_KEY) {
        console.error("❌ Error: La clave de suscripción no está configurada.");
        return null;
    }

    const authHeader = user.bearerToken;
    const requestConfig = {
        method: "post",
        url: "https://apimanagementsoriana.azure-api.net/qa01carrito/v3/api/Basket/payment_instruments",
        params: {
            basketId
         },
        headers: {
            "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY,
            "Content-Type": "application/json",
            Authorization: authHeader,
        },
        data: card,
    };

    try {
        const response = await axios(requestConfig);
        console.log("✅ Tarjeta agregada correctamente.");
        return response.data; 
    } catch (error) {
        console.error("❌ Error al agregar la tarjeta:", error.message);
        return null;
    }
}

module.exports = {addPayment};