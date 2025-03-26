const axios = require("axios");
const addItemData = require("../Dataaa/addItemData.json");
const crearCarrito = require("../Dataaa/crearCarrito.json");
const configData = require("../configData.json"); 
const BasketException = require("../exceptions/BasketException");

class BasketService {
    constructor(user) {
        if (!user || !user.bearerToken || !user.customerId || !user.storeId) {
            throw new BasketException("El usuario no está completamente autenticado.");
        }
        this.user = user;
        }

        async getBasket(basketId) {
            try {
                const config = {
                    method: "get",
                    url: configData.apiUrls.getBasket,
                    params: {
                        storeId: this.user.storeId,
                        postalCode: this.user.postalCode,
                        customerId: this.user.customerId,
                        basketId,
                    },
                    headers: {
                        Authorization: this.user.bearerToken,
                        "Content-Type": "application/json",
                        "Ocp-Apim-Subscription-Key": configData.subscriptionKey,
                    },
                };
                const response = await axios(config);
                console.log("✅ Carrito obtenido con éxito. Basket ID:", response.data.basketId);
                return response.data.basketId || null;
            } catch (error) {
                console.error("❌ Error en getBasket:", error.message);
                return null;
            }
        }
    
      
        async deleteBasket(basketId) {
            if (!basketId) return console.log("❌ El usuario no tenía carrito.");
    
            try {
                const config = {
                    method: "delete",
                    url: configData.apiUrls.deleteBasket,
                    params: {
                        basketId,
                        customerId: this.user.customerId,
                        storeId: this.user.storeId,
                    },
                    headers: {
                        "Ocp-Apim-Subscription-Key": configData.subscriptionKey,
                        "Content-Type": "application/json",
                        Authorization: this.user.bearerToken,
                    },
                };
                const response = await axios(config);
                console.log("✅ Carrito eliminado:", response.data);
            } catch (error) {
                console.error("❌ Error al eliminar el basket:", error.message);
            }
        }
    
       
        async createBasket() {
            try {
                const config = {
                    method: "post",
                    url: configData.apiUrls.createBasket,
                    params: {
                        storeId: this.user.storeId,
                        postalCode: this.user.postalCode,
                    },
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: this.user.bearerToken,
                    },
                    data: crearCarrito,
                };
                const response = await axios(config);
                return response.data.basketId || null;
            } catch (error) {
                console.error("❌ Error en createBasket:", error.message);
                return null;
            }
        }
    
        
        async addItem(basketId) {
            const { bearerToken, storeId, postalCode } = this.user;
    
            const config = {
                method: "post",
                url: configData.apiUrls.addItem,
                params: { basketId, storeId, postalCode },
                headers: {
                    "Ocp-Apim-Subscription-Key": configData.subscriptionKey,
                    "Content-Type": "application/json",
                    Authorization: bearerToken,
                },
                data: addItemData,
            };
    
            try {
                const response = await axios(config);
                console.log("✅ Producto agregado al carrito.");
                return response.data.basketId || null;
            } catch (error) {
                console.error("❌ Error en AddItem:", error.message);
                return null;
            }
        }
}

module.exports = BasketService;
