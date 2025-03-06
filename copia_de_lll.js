const axios = require("axios");

const addItemData = require('./addItemData.json');
const validateSkData = require('./validateSkData.json');
const shipmentData = require('./shipmentData.json');
const rateData = require('./rateData.json');
const orden = require('./orden.json');
const address = require('./address.json');
const card = require('./card.json');
const crearCarrito = require('./crearCarrito.json');
//hola
const { url } = require("inspector");
const { sign } = require("crypto");

// LoginQA 
function getBasicToken(email, password) {
    const authHeader =
        "Basic " + Buffer.from(`${email}:${password}`).toString("base64");
    return authHeader;
}

async function login(email, pass) {
    try {
        const authHeader = getBasicToken(email, pass);
        const config = {
            method: "get",
            url: "https://apimanagementsoriana.azure-api.net/qa01customer/v3/api/Login", 
            headers: {
                "Ocp-Apim-Subscription-Key": "fc362fe582b248f6a11d9241f6948fff", 
                Authorization: authHeader,
            },
        };

        const response = await axios(config);
        const user = {
            bearerToken: response.headers["authorization"], 
            customerId: response.data.customerId,
            email: response.data.email,
            storeId: response.data.c_tempStoreId,
        };

        return user; // No imprime aquí

    } catch (error) {
        console.error("❌ Error en el flujo:", error.message);
    }
}

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

        // Si la respuesta es exitosa, imprime el basketId obtenido
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
            Authorization: user.bearerToken
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
      
// AddItem 
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

        // Solo imprime la respuesta si la operación fue exitosa
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


// SplitShipment 
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
        
        return total; // devuelve solo el total o lo q se necesite
    } catch (error) {
        console.error("❌ Error en splitshipment:", error.message);
        return null;
    }    
}
//addAddress
async function addAddress(user) {
    const authHeader = user.bearerToken;
    const config = {
        method: "post",
        url: "https://apimanagementsoriana.azure-api.net/qa01customer/v3/api/Address",
        params: {
            customerId: user.customerId
            
        },
        headers: {
            "Ocp-Apim-Subscription-Key": "fc362fe582b248f6a11d9241f6948fff",
            "Content-Type": "application/json",
            Authorization: authHeader,
        },
        data: address,
    };
    try {
        const response = await axios(config);

        // Extraer datos clave de la respuesta
        const addressId = response.data.addressId || "No disponible";
        const fullName = response.data.fullName || "No disponible";
        const city = response.data.city || "No disponible";
        const colonia = response.data.c_colonia || "No disponible";
        const phone = response.data.phone || "No disponible";

        console.log(`✅ Dirección agregada:`);
        console.log(`   🏠 ID: ${addressId}`);
        console.log(`   👤 Nombre: ${fullName}`);
        console.log(`   🏙️ Ciudad: ${city}`);
        console.log(`   🏡 Colonia: ${colonia}`);
        console.log(`   📞 Teléfono: ${phone}`);

        return addressId; 
    } catch (error) {
        console.error("❌ Error en address:", error.message);
        return null;
    }
}


// ValidateStock 
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


//addcard
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

// RateTicket 
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

// CreateOrder 
async function createOrder(user) {
    console.log("llamando a createorder");
    const authHeader = user.bearerToken;
    const config = {
        url: "https://apimanagementsoriana.azure-api.net/qa01orden/v3/api/Orders/create",
        method: "post",
        params: {         
        },
        headers: {
            "Content-Type": "application/json",
            Authorization: authHeader, 
            "ocp-apim-subscription-key": "fc362fe582b248f6a11d9241f6948fff",
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

async function getFreshBasket(user) {
    const basketId = await getBasket(user); // Obtener el ID del carrito existente

    if (basketId) {
        await deleteBasket(user, basketId); // Eliminar el carrito si existe
    }

    const newBasketId = await createBasket(user); // Crear un nuevo carrito
    return newBasketId; // Devolver el nuevo ID del carrito
}


async function main() {
    console.log("Inicio del flujo");
    const email = "ipdev@develop.mx";
    const password = "Perrito1q.";

    const user = await login(email, password);
    console.log("Usuario autenticado:", user);

    if (!user || !user.bearerToken) {
        console.error("❌ Error: No se obtuvo un token de autenticación.");
        return;
    }

    const basketId = await getFreshBasket(user);
    console.log("Basket ID obtenido:", basketId);

    if (!basketId) {
        console.error("❌ No se pudo crear un carrito nuevo.");
        return;
    }

    await AddItem(user, basketId);
    await getBasket(user, basketId);
    await splitShipment(user, basketId);
    await addAddress(user);
    await validateStock(user, basketId);
    await addPayment(user, basketId);
    await rateTicket(user, basketId);
    await sleep(10);
    await createOrder(user);

    console.log("Fin del flujo");
}
async function sleep(seconds) {
    console.log('Esperando unos segundos segundos ...');
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
main().catch(error => {
    console.error("Error en el flujo:", error.message);
});//si pasa un error, se imprime el msj 
