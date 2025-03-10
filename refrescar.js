const { getBasket } = require("./get_basket");
const { deleteBasket } = require("./delete");
const {createBasket} = require("./carrito");

async function getFreshBasket(user) {
    try {
        // obtener el ID del carrito existente
        const basketId = await getBasket(user);
        
        if (basketId) {
            console.log(`🛒 Carrito existente encontrado con ID: ${basketId}. Eliminando...`);
            await deleteBasket(user, basketId); // Eliminar el carrito si existe
        } else {
            console.log("🛒 No se encontró un carrito existente.");
        }

        // crear un nuevo carrito
        console.log("🔄 Creando un nuevo carrito...");
        const newBasketId = await createBasket(user); // Crear un nuevo carrito

        if (newBasketId) {
            console.log("✅ Nuevo carrito creado con ID:", newBasketId);
            return newBasketId; // Devolver el nuevo ID del carrito
        } else {
            console.error("❌ Error al crear el nuevo carrito.");
            return null;
        }
    } catch (error) {
        console.error("❌ Error en getFreshBasket:", error.message);
        return null;
    }
}

module.exports = { getFreshBasket };
