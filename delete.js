async function deleteBasket(user, basketId) {
    const authHeader = user.bearerToken;
    if (basketId) {
        const config = {
            method: "delete",
            url: "https://apimanagementsoriana.azure-api.net/qa01carrito/v3/api/Basket",
            params: {
                basketId,
                customerId: user.customerId,
                storeId: user.storeId
            },
            headers: {
                "Ocp-Apim-Subscription-Key": "fc362fe582b248f6a11d9241f6948fff", 
                "Content-Type": "application/json",
            Authorization: authHeader,
            },
        };
        try {
            const response = await axios(config);
            console.log(response.data);
        } catch (error) {
            console.error("❌ Error al eliminar el basket:", error.message);
        }
    } else {
        console.log("EL USUARIO NO TENÍA BASKET");
    }
}