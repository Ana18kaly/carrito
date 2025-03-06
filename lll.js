const axios = require("axios");

const addItemData = require('./addItemData.json');
const validateSkData = require('./validateSkData.json');
const shipmentData = require('./shipmentData.json');
const rateData = require('./rateData.json');
const orden = require('./orden.json');
const address = require('./address.json');
const card = require('./card.json');
const crearCarrito = require('./crearCarrito.json');
//const SP_creditCard = require("./data/startOrderPayment/cc.json");
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

//8