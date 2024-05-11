// making a router plugin
module.exports = {
  name: "api Routes",
  version: "1.0.0",
  register: (server, options) => {
    server.route(require("./auth_routes"));
    server.route(require("./user_routes"));
    server.route(require("./categories_routes"));
    server.route(require("./subcatgeories_routes"));
    server.route(require("./user_address_routes"));
    server.route(require("./products_routes"));
    server.route(require("./cart_routes"));
    server.route(require("./wishlist_routes"));
    server.route(require("./delivery_types_routes"));
    server.route(require("./orders_routers"));
    server.route(require("./banners_routes"));
    server.route(require("./attribute_routes"));
  },
};
