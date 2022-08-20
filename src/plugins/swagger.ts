import fastifySwagger, { SwaggerOptions } from "@fastify/swagger";
import fp from "fastify-plugin";

/**
 * This plugins adds some utilities to create docs for our endpoints
 *
 * @see https://github.com/fastify/fastify-swagger
 */
export default fp<SwaggerOptions>(async (fastify) => {
  fastify.register(fastifySwagger, {
    routePrefix: "/docs",
    swagger: {
      info: {
        title: "API Endpoints",
        description: "Testing the Fastify API Endpoints",
        version: "0.1.0",
      },
      host: "localhost:3000",
      schemes: ["http"],
      consumes: ["application/json"],
      produces: ["application/json"],
      tags: [{ name: "Report", description: "Greenhouse Gas Emission Data" }],
    },
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    exposeRoute: true,
  });
});
