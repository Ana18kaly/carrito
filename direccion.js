async function addAddress(user) {
    const authHeader = user.bearerToken;
    const config = {
        method: "post",
        url: "https://apimanagementsoriana.azure-api.net/qa01customer/v3/api/Address",
        params: {
            customerId: user.customerId
            
        },
        headers: {
            "Ocp-Apim-Subscription-Key": "fc362fe582b248f6a11d9241f6948fff",
            "Content-Type": "application/json",
            Authorization: authHeader,
        },
        data: address,
    };
    try {
        const response = await axios(config);

        // Extraer datos clave de la respuesta
        const addressId = response.data.addressId || "No disponible";
        const fullName = response.data.fullName || "No disponible";
        const city = response.data.city || "No disponible";
        const colonia = response.data.c_colonia || "No disponible";
        const phone = response.data.phone || "No disponible";

        console.log(`✅ Dirección agregada:`);
        console.log(`   🏠 ID: ${addressId}`);
        console.log(`   👤 Nombre: ${fullName}`);
        console.log(`   🏙️ Ciudad: ${city}`);
        console.log(`   🏡 Colonia: ${colonia}`);
        console.log(`   📞 Teléfono: ${phone}`);

        return addressId; 
    } catch (error) {
        console.error("❌ Error en address:", error.message);
        return null;
    }
}