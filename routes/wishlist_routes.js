// describe routes here by creating objects inside the user_routes array
const tags = ["api", "Wishlist"];
const {
  SchoolControllers,
  CategoryControllers,
  CartsControllers,
  WishlistControllers,
} = require("../controllers");
const {
  headerValidator,
  SchoolValidators,
  CategoryValidators,
  CartValidators,
  WishlistValidators,
} = require("../validators");

const wishlist_routes = [
  {
    method: "POST",
    path: "/v1/wishlist/:id",
    options: {
      description: "Add to wishlist by user.",
      tags,
      validate: {
        headers: headerValidator,
        payload: WishlistValidators.add_to_wishlist_payload,
      },
      handler: WishlistControllers.addToWishList,
    },
  },

  {
    method: "GET",
    path: "/v1/wishlist",
    options: {
      description: "Get wishlist by user.",
      tags,
      validate: {
        headers: headerValidator,
        // payload: WishlistValidators
      },
      handler: WishlistControllers.getWishList,
    },
  },

  {
    method: "DELETE",
    path: "/V1/wishlist/:id",
    options: {
      description: "Remove from wishlist by user.",
      tags,
      validate: {
        headers: headerValidator,
        payload: WishlistValidators.remove_from_wishlist_payload,
      },
      handler: WishlistControllers.removeFromWishlist,
    },
  },
];

module.exports = wishlist_routes;
