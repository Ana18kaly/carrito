class EnvioException extends Error {
    constructor(message) {
        super(message);
        this.name = "EnvioException";
    }
}

module.exports = EnvioException;
