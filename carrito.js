const axios = require("axios");
const createBasket = require("./crearCarrito.json"); 
//const crearCarrito = require("./crearCarrito.json"); 

async function createBasket(user) {
    const authHeader = user.bearerToken;
    const config = {
        method: "post",
        url: "https://apimanagementsoriana.azure-api.net/qa01carrito/v3/api/Basket",
        params: {
            storeId: user.storeId,
            postalCode: user.postalCode

        },
        headers: {
            "Content-Type": "application/json",
            Authorization: authHeader //user.bearerToken 
        },
        data: crearCarrito
        
    };
    try {
        const response = await axios(config);

        if (response.data && response.data.basketId) {
            console.log("✅ Carrito creado con éxito. Basket ID:", response.data.basketId);
            return response.data.basketId;
        } else {
            console.error("❌ No se pudo obtener el basketId de la respuesta.");
            return null;
        }
    } catch (error) {
        console.error("❌ Error en createBasket:", error.message);
        return null;
    }
}

module.exports = {createBasket};