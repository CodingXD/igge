import { FastifyPluginAsync } from "fastify";
import { FindOptions, Op } from "sequelize";

const getCountry: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get(
    "/:id",
    {
      schema: {
        tags: ["Report"],
        description:
          "International Greenhouse Gas Emissions For Specific Country",
        summary: "Filter by Country ID & Other Params",
        params: {
          type: "object",
          properties: {
            id: { type: "integer", minimum: 1 },
          },
          required: ["id"],
        },
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
            categories: {
              type: "array",
              items: { type: "string" },
              default: [],
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
                value: { type: "number" },
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
      const { id } = request.params as { id: number };
      const { startYear, endYear, categories } = request.query as {
        startYear: number;
        endYear: number;
        categories: string[];
      };

      try {
        const payload: FindOptions<any> = {
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          where: {
            id: {
              [Op.eq]: id,
            },
            year: {
              [Op.between]: [startYear, endYear],
            },
          },
        };

        if (categories.length > 0) {
          for (let i = 0; i < categories.length; i++) {
            payload.where = {
              ...payload.where,
              category: {
                [Op.like]: `%${categories[i]}%`,
              },
            };
          }
        }

        const data = await fastify.GreenhouseGasInventoryData.findAll(payload);
        console.log({ data });
        return data;
      } catch (error) {
        reply.statusCode = 500;
        return error;
      }
    }
  );
};

export default getCountry;
