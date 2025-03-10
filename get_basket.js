const axios = require("axios");
const config = require("./config.json");

async function getBasket(user, basketId) {
    const authHeader = user.bearerToken;
    console.log("llama a getbasket", basketId);
    const SUBSCRIPTION_KEY = config.subscriptionKey;
    const  requestConfig = {
        method: "get",
        url: "https://apimanagementsoriana.azure-api.net/qa01carrito/v3/api/Basket/GetBasketMild",
        params: {
            storeId: user.storeId,
            postalCode: user.postalCode,
            loyaltyCard: user.loyaltyCard,
            customerId: user.customerId,
            basketId: basketId
        },
        headers: {
            Authorization: authHeader,//user.bearerToken,
            "Content-Type": "application/json",
            "ocp-apim-subscription-key": SUBSCRIPTION_KEY,
        },
    };
    try {
        const response = await axios( requestConfig);

    
        if (response.data && response.data.basketId) {
            console.log("✅ Carrito obtenido con éxito. Basket ID:", response.data.basketId);
            return response.data.basketId;
        } else {
            console.error("❌ No se pudo obtener el carrito.");
            return null;
        }
    } catch (error) {
        console.error("❌ Error en getBasket:", error.message);
        return null;
    }
}
module.exports = {getBasket};
