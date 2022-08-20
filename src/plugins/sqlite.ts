import fp from "fastify-plugin";
import { DataTypes, Model, ModelCtor, Sequelize } from "sequelize";

/**
 * This decorater adds some utilities to handle sqlite
 *
 * @see https://sequelize.org/
 */
export default fp(async (fastify) => {
  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "db/db_filename.db",
    database: "db_filename.db",
  });

  // Schema
  const GreenhouseGasInventoryData = sequelize.define(
    "GreenhouseGasInventoryData",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      country: DataTypes.STRING,
      year: DataTypes.SMALLINT,
      value: DataTypes.FLOAT,
      category: {
        type: DataTypes.STRING,
        get() {
          const rawValue = this.getDataValue("category") as string;
          return rawValue.split(",");
        },
      },
    }
  );

  // Automatically create all tables
  await GreenhouseGasInventoryData.sync();

  // Connect to database
  await sequelize.authenticate();

  fastify.decorate("db", sequelize);
  fastify.decorate("GreenhouseGasInventoryData", GreenhouseGasInventoryData);
});

declare module "fastify" {
  export interface FastifyInstance {
    db: Sequelize;
    GreenhouseGasInventoryData: ModelCtor<Model<any, any>>;
  }
}
