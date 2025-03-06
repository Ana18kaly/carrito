async function splitShipment(user) {
    const authHeader = user.bearerToken;
    const config = {
        method: "post",
        url: "https://apimanagementsoriana.azure-api.net/qa01carrito/v3/api/Checkout/SplitShipment",
        params: {
            customerId: user.customerId,
            
        },
        headers: {
            "Ocp-Apim-Subscription-Key": "fc362fe582b248f6a11d9241f6948fff",
            "Content-Type": "application/json",
            Authorization: authHeader,
        },
        data: shipmentData,
    };
    try {
        const response = await axios(config);
        
        // se imprime el total
        const total = response.data.total;
        console.log("Total del pedido después de dividir el envío: $", total);
        
        return total;
    } catch (error) {
        console.error("❌ Error en splitshipment:", error.message);
        return null;
    }    
}