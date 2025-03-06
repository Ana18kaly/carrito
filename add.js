async function AddItem(user, basketId) {
    console.log("🛒 Llamando a AddItem para el basket ID:", basketId);
    const authHeader = user.bearerToken;
    const config = {
        method: "post",
        url: "https://apimanagementsoriana.azure-api.net/qa01carrito/v3/api/Basket/Items",  
        params: {
            basketId: basketId,
            storeId: user.storeId,
            postalCode: user.postalCode 
        },
        headers: {
            "Ocp-Apim-Subscription-Key": "fc362fe582b248f6a11d9241f6948fff", 
            "Content-Type": "application/json",
            Authorization: authHeader,
        },
        data: addItemData,  
    };
    try {
        const response = await axios(config);

        
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