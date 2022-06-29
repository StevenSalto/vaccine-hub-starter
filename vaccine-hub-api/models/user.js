const db = require("../db")
const bcrypt = require("bcrypt")
const {BadRequestError, UnauthorizedError} = require("../utils/errors")
const {BCRYPT_WORK_FACTOR} = require("../config")

class User {
    static async login(credentials) {
        console.log(credentials)
        const requiredFields = ["email", "password"];
        requiredFields.forEach(field => {
            if (!credentials.hasOwnProperty(field)){
                throw new BadRequestError(`Missing ${field} in req body`)
            }
        })

        const user = await User.fetchUserByEmail(credentials.email);

        if(user){
            const isValid = await bcrypt.compare(credentials.password, user.password)
            if (isValid) {
                console.log("valid")
                return user;
            }
        }

        throw new UnauthorizedError("Invalid email/password combo")
    }


    static async register(credentials) {
        const requiredFields = ["email", "password", "firstName", "lastName", "location"];
        requiredFields.forEach(field => {
            if (!credentials.hasOwnProperty(field)){
                throw new BadRequestError(`Missing ${field} in req body`)
            }
        })

        const existingUser = await User.fetchUserByEmail(credentials.email)
        if(existingUser){
            throw new BadRequestError(`Duplicate email: ${credentials.email}`);
        }
        const hashedPassword = await bcrypt.hash(credentials.password, BCRYPT_WORK_FACTOR);

        const lowerCaseEmail = credentials.email.toLowerCase();

        const result = await db.query(
            `INSERT INTO users (password, first_name, last_name, email, location)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, password, first_name AS "firstName", last_name AS "lastName", email, location, date;`,
            [hashedPassword, credentials.firstName, credentials.lastName, lowerCaseEmail, credentials.location]
        )

        const user = result.rows[0]
        console.log(user);
        return user
    }

    static async fetchUserByEmail(email) {
        if(!email) {
            throw new BadRequestError("No email provided")
        }
        const query = 'SELECT * FROM users WHERE email = $1';

        const result = await db.query(query, [email.toLowerCase()])

        const user = result.rows[0]

        user['firstName'] = user['first_name'];
        delete user['first_name'];
        user['lastName'] = user['last_name'];
        delete user['last_name'];
        console.log(user, "fetched")
        return user;
    }
}

module.exports = User;