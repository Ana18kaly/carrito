const axios = require("axios");
const config = require("./config.json");

async function createOrder(user) {
    console.log("llamando a createorder");
    const authHeader = user.bearerToken;

    const SUBSCRIPTION_KEY = config.subscriptionKey;

    const requestConfig = {
        url: "https://apimanagementsoriana.azure-api.net/qa01orden/v3/api/Orders/create",
        method: "post",
        params: {},
        headers: {
            "Content-Type": "application/json",
            Authorization: authHeader, 
            "ocp-apim-subscription-key": SUBSCRIPTION_KEY,
            "version": "32.1.8.1",
            "dispositivo": "App_Android", 
            "content-type": "application/json; charset=UTF-8"
        },
        data: orden,

    };
    try {
        const response = await axios(requestConfig);

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

        // manejo de error por conexión y reintento
        if (error.code === 'ECONNRESET' && retries > 0) {
            console.log(`🔄 Reintentando... Intentos restantes: ${retries}`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // espera 1seg antes de reintentar
            return createOrder(user, retries - 1);
        }

        return null;
    }
}
module.exports = {createOrder};