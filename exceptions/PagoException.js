class PagoException extends Error {
    constructor(message) {
        super(message);
        this.name = "PagoException";
    }
}

module.exports = PagoException;
