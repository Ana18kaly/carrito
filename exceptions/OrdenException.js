class OrdenException extends Error {
    constructor(message) {
        super(message);
        this.name = "OrdenException";
    }
}

module.exports = OrdenException;
