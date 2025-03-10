const axios = require("axios");
const config = require("./config.json");


async function deleteBasket(user, basketId) {
    const authHeader = user.bearerToken;
    const SUBSCRIPTION_KEY = config.subscriptionKey;
    if (basketId) {
        const requestConfig = {
            method: "delete",
            url: "https://apimanagementsoriana.azure-api.net/qa01carrito/v3/api/Basket",
            params: {
                basketId,
                customerId: user.customerId,
                storeId: user.storeId
            },
            headers: {
                "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY, 
                "Content-Type": "application/json",
            Authorization: authHeader,
            },
        };
        try {
            const response = await axios(requestConfig);
            console.log("✅ Carrito eliminado:", response.data);
        } catch (error) {
            console.error("❌ Error al eliminar el carrito:", error.message);
        }
    } else {
        console.log("EL USUARIO NO TENÍA CARRITO");
    }
}
module.exports = {deleteBasket};