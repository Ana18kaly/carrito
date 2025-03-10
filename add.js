const axios = require("axios");
const config = require("./config.json");

async function AddItem(user, basketId) {
    console.log("🛒 Llamando a AddItem para el basket ID:", basketId);

    const SUBSCRIPTION_KEY = config.subscriptionKey; 

    if (!SUBSCRIPTION_KEY) {
        console.error("❌ Error: La clave de suscripción no está configurada.");
        return null;
    }

    const authHeader = user.bearerToken;
    const requestConfig = {
        method: "post",
        url: "https://apimanagementsoriana.azure-api.net/qa01carrito/v3/api/Basket/Items",  
        params: {
            basketId: basketId,
            storeId: user.storeId,
            postalCode: user.postalCode 
        },
        headers: {
            "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY, 
            "Content-Type": "application/json",
            Authorization: authHeader,
        },
        data: addItemData,  
    };
    try {
        const response = await axios(requestConfig);

        
        if (response.data && response.data.basketId) {
            console.log("✅ Producto agregado al carrito. Basket ID actualizado:", response.data.basketId);
            return response.data.basketId;
        } else {
            console.error("❌ No se pudo agregar el producto al carrito.");
            return null;
        }
    } catch (error) {
        console.error("❌ Error en AddItem:", error.message);
        return null;
    }
}
module.exports = {AddItem};