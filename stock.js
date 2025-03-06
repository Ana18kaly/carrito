async function validateStock(user) {
    console.log("validando al stock");
    const authHeader = user.bearerToken;
    const config = {
        method: "post",
        url: "https://apimanagementsoriana.azure-api.net/qa01carrito/v3/api/Checkout/ValidateStock",
        params: {
            customerId: user.customerId,
            loyaltyCard: user.loyaltyCard
        },
        headers: {
            "Ocp-Apim-Subscription-Key": "fc362fe582b248f6a11d9241f6948fff",
            "Content-Type": "application/json",
            Authorization: authHeader,
        },
        data: validateSkData,
    };

    try {
        const response = await axios(config);
        
        console.log("✅ Validado");
    } catch (error) {
        console.error("❌ Error en validateStock:", error.message);
    }
}
