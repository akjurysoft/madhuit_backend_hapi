"use strict";
// importing env data from config file
const { env, sequelize, } = require("./config");
// importing routes
const routes = require("./routes");

const {
  imageValidator
} = require('./validators')
// importing sequelize file
const seq = require("./config/sequelize");

// importing packages
const Hapi = require("@hapi/hapi");
const Inert = require("@hapi/inert");
const Vision = require("@hapi/vision");
const HapiSwagger = require("hapi-swagger");
const Pack = require("./package");
// const SocketIO = require('socket.io');
const HapiCors = require('hapi-cors');

// const connectedUsers = {};
// const { setIoInstance } = require('./socketIoInstance');

// const {
//   CategoriesTableAssociation,
//   VendorProductAssociation,
//   Electronics,
//   Fashion,
//   Groceries,
//   HardWare,
//   HomeDecore,
//   HealthBeauty,
//   ImagesForProducts,
//   VendorSubCategory,
//   VendorSubCategoryProductAssociation
// } = require('./models')

// initializing server
const init = async () => {
  // creating a hapi server
  const server = Hapi.server({
    port: env.PORT,
    // host: env.HOST,
    host: '0.0.0.0',
    routes: {
      cors: true,
      validate: {
        failAction: async (request, h, err) => {
          console.error('Errors: ', err);
          throw err;
        }
      },
      timeout: {
          server: 60000, // 60 seconds
          socket: 60000, // 60 seconds
      },
    }
  });

  // // Register Hapi CORS plugin
  await server.register({
    plugin: HapiCors,
    options: {
      origins: ['*'], // Adjust as needed for your specific requirements
    },
  });

  // adding swagger dependencies
  const swaggerOptions = {
    info: {
      title: "Chimmy Garments API Documentation",
      version: Pack.version,
    },
    sortEndpoints: "ordered",
    grouping: "tags",
    schemes: ["http", "https"],
  };
  // registering swagger
  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);
  await server.register(require('hapi-response-time'));
  server.route({
    method: "GET",
    path: "/uploads/{path}/{image}",
    options: {  
      description: "Fetching static files.",
      // tags,
      validate: {
        // headers: headerValidator,
        params: imageValidator
      },
      handler:  async (req, res) => {
        try {
          const { image , path } = req.params;
          console.log(image)
          const filepath = `./uploads/${path}/${image}`;
          return res.file(filepath);
        } catch (error) {
          return res
            .response({
              code: 400,
              status: "error",
              message: error.message,
            })
            .code(200);
        }
      }
    },
  })

  // starting the server
  await server.start();
  // registering the server with a prefix
  // so after base route we need to add /api and
  // then the route which needs to be accessed
  
  await server.register(routes, {
    routes: {
      prefix: "/api",
    },
  });

  (async (sequelize) => {
    try {
      await sequelize.authenticate();
      console.log("Database connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  })(seq);
  // logging the request method, url, payload, query, params
  server.ext("onRequest", (request, h) => {
    console.log(`${request.method.toUpperCase()} || ${request.url}`);
    console.log("--------------*--------------");
    return h.continue;
  });
  console.log("Server running on %s", server.info.uri);
  console.log("--------------*--------------");
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();

