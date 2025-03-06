async function getBasket(user, basketId) {
    const authHeader = user.bearerToken;
    console.log("llama a getbasket", basketId);
    const config = {
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
            Authorization: user.bearerToken,
            "Content-Type": "application/json",
            "ocp-apim-subscription-key": "fc362fe582b248f6a11d9241f6948fff",
        },
    };
    try {
        const response = await axios(config);

    
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
