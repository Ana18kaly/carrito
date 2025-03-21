const axios = require("axios");

const configData = require('./configData.json');

const addItemData = require('./addItemData.json');
const validateSkData = require('./validateSkData.json');
const shipmentData = require('./shipmentData.json');
const rateData = require('./rateData.json');
const orden = require('./orden.json');
const address = require('./address.json');
const card = require('./card.json');
const crearCarrito = require('./crearCarrito.json');

class AuthService {
    static getBasicToken(email, password) {
        return "Basic " + Buffer.from(`${email}:${password}`).toString("base64");
    }

    static async login(email, password) {
        try {
            const authHeader = AuthService.getBasicToken(email, password);
            const config = {
                method: "get",
                url: "https://apimanagementsoriana.azure-api.net/qa01customer/v3/api/Login", 
                headers: {
                    "Ocp-Apim-Subscription-Key": configData.subscriptionKey, 
                    Authorization: authHeader,
                },
            };

            const response = await axios(config);

            // Imprimir la respuesta completa para depurar
            
            

            if (!response.data || !response.headers["authorization"]) {
                throw new Error("No se recibieron los datos necesarios del API.");
            }

            return {
                bearerToken: response.headers["authorization"],
                customerId: response.data.customerId,
                email: response.data.email,
                storeId: response.data.c_tempStoreId,
            };
        } catch (error) {
            console.error("❌ Error en el login:", error.message);
            // Imprimir detalles completos del error para más información
            console.error(error.response ? error.response.data : error.message);
            return null;
        }
    }
}


class BasketService {
    constructor(user) {
        if (!user || !user.bearerToken || !user.customerId || !user.storeId) {
            throw new Error("El usuario no está completamente autenticado.");
        }
        this.user = user;
    }

    
    async getBasket(basketId) {
        try {
            const config = {
                method: "get",
                url: "https://apimanagementsoriana.azure-api.net/qa01carrito/v3/api/Basket/GetBasketMild",
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
                url: "https://apimanagementsoriana.azure-api.net/qa01carrito/v3/api/Basket",
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
                url: "https://apimanagementsoriana.azure-api.net/qa01carrito/v3/api/Basket",
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
            url: "https://apimanagementsoriana.azure-api.net/qa01carrito/v3/api/Basket/Items",
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

class EnvioService {
    constructor(user) {
        
        if (!user || !user.bearerToken || !user.customerId || !user.storeId) {
            console.error("❌ El servicio de autenticación no está correctamente inicializado.");
            throw new Error("El servicio de autenticación no está correctamente inicializado.");
        }
        this.user = user;
    }

    async addAddress() {
        const { bearerToken, customerId } = this.user;
        if (!bearerToken || !customerId) {
            console.error("❌ Error: El usuario no está autenticado correctamente.");
            return;
        }

        const config = {
            method: "post",
            url: "https://apimanagementsoriana.azure-api.net/qa01customer/v3/api/Address",
            params: { customerId },
            headers: {
                "Ocp-Apim-Subscription-Key": configData.subscriptionKey,
                "Content-Type": "application/json",
                Authorization: bearerToken,
            },
            data: address,
        };

        try {
            const response = await axios(config);
            console.log(`✅ Dirección agregada: ${response.data.addressId || "No disponible"}`);
        } catch (error) {
            console.error("❌ Error en addAddress:", error.message);
        }
    }

    async splitShipment() {
        const { bearerToken, customerId } = this.user;

        const config = {
            method: "post",
            url: "https://apimanagementsoriana.azure-api.net/qa01carrito/v3/api/Checkout/SplitShipment",
            params: { customerId },
            headers: {
                "Ocp-Apim-Subscription-Key": configData.subscriptionKey,
                "Content-Type": "application/json",
                Authorization: bearerToken,
            },
            data: shipmentData,
        };

        try {
            const response = await axios(config);
            console.log("✅ Envío dividido. Total: $", response.data.total);
        } catch (error) {
            console.error("❌ Error en splitShipment:", error.message);
        }
    }
}

class PagoService {
    constructor(user) {
        
        if (!user || !user.bearerToken || !user.customerId || !user.storeId) {
            console.error("❌ El servicio de pago no está correctamente inicializado.");
            throw new Error("El servicio de pago no está correctamente inicializado.");
        }
        this.user = user;
    }

    async addPayment(basketId) {
        if (!this.user || !this.user.bearerToken) {
            console.error("❌ Error: El usuario no está autenticado.");
            return null;
        }
        const config = {
            method: "post",
            url: "https://apimanagementsoriana.azure-api.net/qa01carrito/v3/api/Basket/payment_instruments",
            params: { basketId },
            headers: {
                "Ocp-Apim-Subscription-Key": configData.subscriptionKey,
                "Content-Type": "application/json",
                Authorization: this.user.bearerToken,
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
}

class OrdenService {
    constructor(user) {
        
        if (!user || !user.bearerToken || !user.customerId || !user.storeId) {
            console.error("❌ El servicio de órdenes no está correctamente inicializado.");
            throw new Error("El servicio de órdenes no está correctamente inicializado.");
        }
        this.user = user;
    }

    async validateStock() {
        const { bearerToken, customerId } = this.user;

        const config = {
            method: "post",
            url: "https://apimanagementsoriana.azure-api.net/qa01carrito/v3/api/Checkout/ValidateStock",
            params: { customerId },
            headers: {
                "Ocp-Apim-Subscription-Key": configData.subscriptionKey,
                "Content-Type": "application/json",
                Authorization: bearerToken,
            },
            data: validateSkData,
        };

        try {
            await axios(config);
            console.log("✅ Stock validado.");
        } catch (error) {
            console.error("❌ Error en validateStock:", error.message);
        }
    }

    async rateTicket() {
        const { bearerToken, customerId } = this.user;

        const config = {
            method: "post",
            url: "https://apimanagementsoriana.azure-api.net/qa01carrito/v3/api/Checkout/RateTicket",
            params: { customerId },
            headers: {
                "Ocp-Apim-Subscription-Key": configData.subscriptionKey,
                "Content-Type": "application/json",
                Authorization: bearerToken,
            },
            data: rateData,
        };

        try {
            const response = await axios(config);
            console.log("✅ Ticket calificado correctamente.");
        } catch (error) {
            console.error("❌ Error en rateTicket:", error.message);
        }
    }

    async createOrder() {
    const authHeader = this.user.bearerToken;
    const config = {
        url: "https://apimanagementsoriana.azure-api.net/qa01orden/v3/api/Orders/create",
        method: "post",
        params: {         
        },
        headers: {
            "Content-Type": "application/json",
            Authorization: authHeader, 
            "ocp-apim-subscription-key": configData.subscriptionKey,
            "version": "32.1.8.1",
            "dispositivo": "App_Android", 
            "content-type": "application/json; charset=UTF-8"
        },
        data: orden

    };
    try {
        const response = await axios(config);

        if (response.data && response.data.orderNo) {
            console.log("✅ Número de orden:", response.data.orderNo);
            
            return response.data.orderNo;
        } else {
            console.warn("⚠️ Respuesta inesperada de la API:", response.data);
            console.log(JSON.stringify(response.data, null, 2));
            return null;
        }
    } catch (error) {
        console.error("❌ Error en createOrder:", error.message);

        if (error.response) {
            console.error("📌 Detalles del error:",  JSON.stringify(error.response.data, null, 2));
        }

        // Manejo de error por conexión y reintento
        if (error.code === 'ECONNRESET' && retries > 0) {
            console.log(`🔄 Reintentando... Intentos restantes: ${retries}`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Espera 1s antes de reintentar
            return createOrder(user, retries - 1);
        }

        return null;
    }
}
}

const sleep = (seconds) => new Promise(resolve => setTimeout(resolve, seconds * 1000));


async function main() {
    console.log("🔄 Inicio del flujo");

    // Obtener el token de autenticación primero
    const userAuth = await AuthService.login("ipdev@develop.mx", "Perrito1q.");

    // Verificar si el login fue exitoso
    if (!userAuth) {
        console.error("❌ Error: No se pudo autenticar al usuario.");
        return;
    }

    console.log("✅ Usuario autenticado:", userAuth);

    // Crear instancias de los servicios, pasando el usuario autenticado
    try {
        const basketService = new BasketService(userAuth);
        const envioService = new EnvioService(userAuth);
        const pagoService = new PagoService(userAuth);
        const ordenService = new OrdenService(userAuth);

        // **Crear Carrito**
        const basketId = await basketService.createBasket();
        if (!basketId) {
            console.error("❌ Error: No se pudo crear un carrito.");
            return;
        }

        // **Operaciones adicionales** como agregar ítems, agregar dirección, etc.
        await basketService.addItem(basketId);
        await basketService.getBasket();
        await envioService.splitShipment();
        await envioService.addAddress();
        await pagoService.addPayment(basketId);
        await ordenService.validateStock();
        await ordenService.rateTicket();
        await sleep(10);
        await ordenService.createOrder();
    } catch (error) {
        console.error("❌ Error en el flujo de servicios:", error.message);
    }
}

main();

