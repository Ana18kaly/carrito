async function getFreshBasket(user) {
    const basketId = await getBasket(user); // Obtener el ID del carrito existente

    if (basketId) {
        await deleteBasket(user, basketId); // Eliminar el carrito si existe
    }

    const newBasketId = await createBasket(user); // Crear un nuevo carrito
    return newBasketId; // Devolver el nuevo ID del carrito
}