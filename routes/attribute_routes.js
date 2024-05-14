// describe routes here by creating objects inside the user_routes array
const tags = ["api", "Attributes"];
const { AuthControllers, AttributesControllers } = require("../controllers");
const {
  headerValidator,
  AuthValidators,
  AttributeValidators,
} = require("../validators");

const attribute_routes = [
  {
    method: "GET",
    path: "/v1/attributes",
    options: {
      description: "Fetch all Attributes.",
      validate: {
        headers: headerValidator,
        query: AttributeValidators.fetch_all_attributes_validator,
      },
      tags,
      handler: AttributesControllers.getAttributes,
    },
  },
  {
    method: "POST",
    path: "/v1/attributes",
    options: {
      description: "Add New Attributes.",
      validate: {
        headers: headerValidator,
        payload: AttributeValidators.add_attributes_validator,
      },
      tags,
      handler: AttributesControllers.addAttributes,
    },
  },
  {
    method: "PUT",
    path: "/v1/attributes",
    options: {
      description: "Edit Attributes.",
      validate: {
        headers: headerValidator,
        payload: AttributeValidators.updateAttributesValidator,
      },
      tags,
      handler: AttributesControllers.editAttributes,
    },
  },
  {
    method: "DELETE",
    path: "/v1/attributes",
    options: {
      description: "Delete Attributes.",
      validate: {
        headers: headerValidator,
        query: AttributeValidators.deleteAttributesValidator,
      },
      tags,
      handler: AttributesControllers.deleteAttribute,
    },
  },
  {
    method: "POST",
    path: "/v1/attributes-status",
    options: {
      description: "Status change Attributes.",
      validate: {
        headers: headerValidator,
        query: AttributeValidators.statusChangeAttributesValidator,
      },
      tags,
      handler: AttributesControllers.toggleAttributeStatus,
    },
  },
];

module.exports = attribute_routes;
