// describe routes here by creating objects inside the user_routes array
const tags = ["api", "Auth"];
const { AuthControllers } = require("../controllers");
const { headerValidator, AuthValidators } = require("../validators");

const auth_routes = [
  {
    method: "POST",
    path: "/v1/register-users",
    options: {
      description: "Registering user.",
      tags,
      validate: {
        payload: AuthValidators.user_register_payload,
      },
      handler: AuthControllers.register,
    },
  },
  {
    method: "POST",
    path: "/v1/admin-login",
    options: {
      description: "Login admin.",
      tags,
      validate: {
        payload: AuthValidators.user_login_payload,
      },
      handler: AuthControllers.adminLogin,
    },
  },
  {
    method: "POST",
    path: "/v1/login-users",
    options: {
      description: "Login user.",
      tags,
      validate: {
        payload: AuthValidators.user_login_payload,
      },
      handler: AuthControllers.login,
    },
  },
  {
    method: "GET",
    path: "/v1/users",
    options: {
      description: "Getting user details.",
      tags,
      validate: {
        headers: headerValidator,
      },
      handler: AuthControllers.getUser,
    },
  },
];

module.exports = auth_routes;
