import { FastifyPluginAsync } from "fastify";
import { Op } from "sequelize";

const getCountries: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.get(
    "/",
    {
      schema: {
        tags: ["Report"],
        description: "International Greenhouse Gas Emissions",
        summary: "Filter by Year",
        querystring: {
          type: "object",
          properties: {
            startYear: {
              type: "integer",
              minimum: 1990,
              maximum: new Date().getFullYear(),
            },
            endYear: {
              type: "integer",
              minimum: 1990,
              maximum: new Date().getFullYear(),
            },
          },
          required: ["startYear", "endYear"],
        },
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "integer" },
                country: { type: "string" },
                year: { type: "integer" },
                category: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
      },
    },
    async function (request, reply) {
      const { startYear, endYear } = request.query as {
        startYear: number;
        endYear: number;
      };
      try {
        const data = await fastify.GreenhouseGasInventoryData.findAll({
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          where: {
            year: {
              [Op.between]: [startYear, endYear],
            },
          },
        });
        return data;
      } catch (error) {
        reply.statusCode = 500;
        return error;
      }
    }
  );
};

export default getCountries;
