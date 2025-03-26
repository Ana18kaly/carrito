const axios = require("axios");
const configData = require("./configData.json");

const AuthService = require("./services/AuthServices");
const BasketService = require("./services/BasketServices");
const EnvioService = require("./services/EnvioServices");
const PagoService = require("./services/PagoServices");
const OrdenService = require("./services/OrdenServices");


const AuthException = require("./exceptions/AuthException");
const BasketException = require("./exceptions/BasketException");
const EnvioException = require("./exceptions/EnvioException");
const PagoException = require("./exceptions/PagoException");
const OrdenException = require("./exceptions/OrdenException");


const sleep = (seconds) => new Promise(resolve => setTimeout(resolve, seconds * 1000));

async function main() {
    console.log("🔄 Inicio del flujo");

    try {
        
        const { username, password } = configData.auth;  
        
        const userAuth = await AuthService.login(username, password); // pasa las credenciales q se extraen
        
        if (!userAuth) throw new AuthException("No se pudo autenticar al usuario.");
        console.log("✅ Usuario autenticado:", userAuth);

        //crear instancias 
        const basketService = new BasketService(userAuth);
        const envioService = new EnvioService(userAuth);
        const pagoService = new PagoService(userAuth);
        const ordenService = new OrdenService(userAuth);

        //crear carrito
        const basketId = await basketService.createBasket();
        if (!basketId) throw new BasketException("No se pudo crear un carrito.");
        console.log("🛒 Carrito creado con ID:", basketId);

        //agg items y obtener carrito
        await basketService.addItem(basketId);
        await basketService.getBasket(basketId);
        console.log("🛍️ Ítems añadidos y carrito actualizado.");

        //direccion y envio
        await envioService.addAddress();
        await envioService.splitShipment();
        console.log("📦 Dirección añadida y envío dividido correctamente.");

        //agg pago
        await pagoService.addPayment(basketId);
        console.log("💳 Pago agregado correctamente.");

        //validar stock y ticket
        await ordenService.validateStock();
        await ordenService.rateTicket();
        console.log("📊 Stock validado y ticket calificado.");

        console.log("⏳ Esperando 10 segundos antes de crear la orden...");
        await sleep(10);

        // crear ordennn
        await ordenService.createOrder();
        console.log("✅ Orden creada exitosamente.");

    } catch (error) {
        console.error("❌ Error en el flujo:", error.message);
    }
}

main();
