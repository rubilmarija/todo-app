const Sequelize = require("sequelize");

const initializeDB = async () => {
  const sequelize = new Sequelize(
    process.env.DBNAME,
    process.env.USERNAME,
    process.env.PASSWORD,
    {
      host: process.env.URL,
      port: process.env.PORT,
      dialect: "postgres",
    }
  );

  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    await sequelize.sync({ force: true });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

  const Task = require("./task")(sequelize);

  return { Task };
};

module.exports = {
  initializeDB,
};
