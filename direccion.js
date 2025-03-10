const axios = require("axios");
const config = require("./config.json");

async function addAddress(user) {
    const SUBSCRIPTION_KEY = config.subscriptionKey; 

    if (!SUBSCRIPTION_KEY) {
        console.error("❌ Error: La clave de suscripción no está configurada.");
        return null;
    }

    const authHeader = user.bearerToken;

    const requestConfig = { // renombre para evitar conflicto
        method: "post",
        url: "https://apimanagementsoriana.azure-api.net/qa01customer/v3/api/Address",
        params: {
            customerId: user.customerId
        },
        headers: {
            "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY, // Aquí ya se usa correctamente
            "Content-Type": "application/json",
            Authorization: authHeader,
        },
        data: address, 
    };

    try {
        const response = await axios(requestConfig);

        const {
            addressId = "No disponible",
            fullName = "No disponible",
            city = "No disponible",
            c_colonia: colonia = "No disponible",
            phone = "No disponible"
        } = response.data;

        console.log(`✅ Dirección agregada:`);
        console.log(`   🏠 ID: ${addressId}`);
        console.log(`   👤 Nombre: ${fullName}`);
        console.log(`   🏙️ Ciudad: ${city}`);
        console.log(`   🏡 Colonia: ${colonia}`);
        console.log(`   📞 Teléfono: ${phone}`);

        return addressId;
    } catch (error) {
        console.error("❌ Error en agregar la dirección:", error.message);
        return null;
    }
}

module.exports = { addAddress }; 