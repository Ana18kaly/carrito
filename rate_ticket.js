async function rateTicket(user) {
    console.log("llamando a rateticket");
    const authHeader = user.bearerToken;
    const config = {
        method: "post",
        url: "https://apimanagementsoriana.azure-api.net/qa01carrito/v3/api/Checkout/RateTicket",
        params: {
            customerId: user.customerId,
            
        },
        headers: {
            "Ocp-Apim-Subscription-Key": "fc362fe582b248f6a11d9241f6948fff",
            "Content-Type": "application/json",
            Authorization: authHeader,
        },
        data: rateData,
    };
    try {
        await axios(config);
        console.log("✅ Ticket calificado correctamente.");
    } catch (error) {
        console.error("❌ Error en rateTicket", error.message);
    }
}