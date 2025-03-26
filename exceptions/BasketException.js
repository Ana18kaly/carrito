class BasketException extends Error {
    constructor(message) {
        super(message);
        this.name = "BasketException";
    }
}

module.exports = BasketException;
