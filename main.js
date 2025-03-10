const { login } = require('./auth');
const { createBasket } = require('./carrito');
const { getFreshBasket } = require('./refrescar');
const { getBasket } = require('./get_basket');
const { AddItem } = require('./add');
const { splitShipment } = require('./envio');
const { addAddress } = require('./direccion');
const { validateStock } = require('./stock');
const { addPayment } = require('./pago');
const { rateTicket } = require('./rate_ticket');
const { createOrder } = require('./crear_orden');



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
    console.log('Esperando unos segundos ...');
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
main().catch(error => {
    console.error("Error en el flujo:", error.message);
});//si pasa un error, se imprime el msj 