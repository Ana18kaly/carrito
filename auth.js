const axios = require("axios");
const config = require("./config.json");

// Función para obtener el token básico de autenticación
function getBasicToken(email, password) {
    const authHeader = "Basic " + Buffer.from(`${email}:${password}`).toString("base64");
    return authHeader;
}

// Función para login que obtiene el bearerToken del usuario
async function login(email, password) {
    try {
        // Obtener el token básico de autenticación
        const authHeader = getBasicToken(email, password);
        
        // Leer la clave de suscripción desde el archivo config.json
        const SUBSCRIPTION_KEY = config.subscriptionKey;

        // Configuración para la solicitud de login
        const configRequest = {
            method: "get",
            url: "https://apimanagementsoriana.azure-api.net/qa01customer/v3/api/Login",
            headers: {
                "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY,
                Authorization: authHeader,
            },
        };

        // Realizar la solicitud
        const response = await axios(configRequest);

        // Crear el objeto user con la información del usuario y el bearerToken
        const user = {
            bearerToken: response.headers["authorization"], // Token de autenticación del usuario
            customerId: response.data.customerId,           // ID del cliente
            email: response.data.email,                     // Correo del usuario
            storeId: response.data.c_tempStoreId,           // ID de la tienda temporal
        };

        return user; // Devolver el objeto user con la información del usuario

    } catch (error) {
        console.error("❌ Error en el flujo:", error.message);
        throw error; // Propagar el error
    }
}

module.exports = { login };
