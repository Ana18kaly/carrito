const axios = require("axios");
const config = require("./config.json");

async function rateTicket(user) {
    console.log("llamando a rateticket");
    const authHeader = user.bearerToken;
    const SUBSCRIPTION_KEY = config.subscriptionKey;
    const requestConfig = {
        method: "post",
        url: "https://apimanagementsoriana.azure-api.net/qa01carrito/v3/api/Checkout/RateTicket",
        params: {
            customerId: user.customerId,
            
        },
        headers: {
            "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY,
            "Content-Type": "application/json",
            Authorization: authHeader,
        },
        data: rateData,
    };
    try {
        await axios(requestConfig);
        console.log("✅ Ticket calificado correctamente.");
    } catch (error) {
        console.error("❌ Error en rateTicket", error.message);
    }
}
module.exports = {rateTicket};