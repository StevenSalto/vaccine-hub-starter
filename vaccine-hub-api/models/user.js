const db = require("../db")
const {UnauthorizedError} = require("../utils/errors")

class User {
    static async login() {
    // user should submit email and password
    // throw error if missing field
    //
    // looup user email in db
        throw new UnauthorizedError("Invalid email/password combo")
    }

    static async register() {
        
    }
}

module.exports = User;