import fastifyCaching, { FastifyCachingPluginOptions } from "@fastify/caching";
import fp from "fastify-plugin";

/**
 * This plugins adds some utilities to handle caching
 *
 * @see https://github.com/fastify/fastify-caching
 */
export default fp<FastifyCachingPluginOptions>(async (fastify) => {
  fastify.register(fastifyCaching, {
    privacy: fastifyCaching.privacy.PRIVATE,
    expiresIn: 86400,
  });
});
