const axios = require("axios");
const config = require("./config.json");

async function validateStock(user) {
    console.log("validando al stock");
    const SUBSCRIPTION_KEY = config.subscriptionKey;

    if (!SUBSCRIPTION_KEY) {
        console.error("❌ Error: La clave de suscripción no está configurada.");
        return null;
    }

    const authHeader = user.bearerToken;
    const requestConfig = {
        method: "post",
        url: "https://apimanagementsoriana.azure-api.net/qa01carrito/v3/api/Checkout/ValidateStock",
        params: {
            customerId: user.customerId,
            loyaltyCard: user.loyaltyCard
        },
        headers: {
            "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY,
            "Content-Type": "application/json",
            Authorization: authHeader,
        },
        data: validateSkData,
    };

    try {
        const response = await axios(requestConfig);
        console.log("✅ Stock validado con éxito");
        return response.data;
    } catch (error) {
        console.error("❌ Error en validateStock:", error.message);
        return null;
    }
}

module.exports = { validateStock };
