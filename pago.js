async function addPayment(user, basketId) {
    console.log("llamando card");
    const authHeader = user.bearerToken;
    const config = {
        method: "post",
        url: "https://apimanagementsoriana.azure-api.net/qa01carrito/v3/api/Basket/payment_instruments",
        params: {
            basketId
         },
        headers: {
            "Ocp-Apim-Subscription-Key": "fc362fe582b248f6a11d9241f6948fff",
            "Content-Type": "application/json",
            Authorization: authHeader,
        },
        data: card,
    };

    try {
        const response = await axios(config);
        console.log("✅ Tarjeta agregada correctamente.");
        return response.data; 
    } catch (error) {
        console.error("❌ Error al agregar la tarjeta:", error.message);
        return null;
    }
}