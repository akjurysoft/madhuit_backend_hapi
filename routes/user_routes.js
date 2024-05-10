// describe routes here by creating objects inside the user_routes array
const tags = ["api", "User"];
const {
    UserControllers
} = require('../controllers')
const { headerValidator, UserValidators } = require('../validators');

const user_routes = [
    {
        method: "POST",
        path: "/user/user-reset-password",
        options: {
            description: "Reset password from profile.",
            tags,
            validate: {
                headers: headerValidator,
                payload: UserValidators.reset_password_from_profile
            },
            handler: UserControllers.resetPassword,
        },
    },
]

module.exports = user_routes