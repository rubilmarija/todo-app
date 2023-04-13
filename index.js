const morgan = require("morgan");
const express = require("express");
const bodyParser = require("body-parser");

require("dotenv").config(); // library for environment variables

const { initializeDB } = require("./database");

const passDbAroundMiddleware = (db) => {
  return (req, res, next) => {
    req.db = db;
    next();
  };
};

// putting everything inside a function to avoid global variables
const main = async () => {
  const db = await initializeDB();

  const app = express(); // creates express app

	// middleware
  app.use(morgan("tiny")); // Logs HTTP requests to the console in a clean format.
  app.use(bodyParser.json()); // Parses incoming request bodies in JSON format
  app.use(passDbAroundMiddleware(db));

	// get all existing tasks
  app.get("/tasks", async (req, res) => {
    const tasks = await req.db.Task.findAll();
    res.json(tasks.map((t) => t.toJSON()));
    console.log(tasks);
    res.end();
  });

	// create new task
  app.post("/task", async (req, res) => {
    const { title, completed } = req.body;
    const task = await req.db.Task.create({ title, completed });
    res.json(task.toJSON());
  });

  // update completed status
	app.patch("/task/:id", async (req, res) => {
    const { completed } = req.body;
  	const { id } = req.params;
  	await req.db.Task.update({ completed }, { where: { id } });
  	res.end();
  });

  // delete task
  app.delete("/task/:id", async (req, res) => {
    const { id } = req.params;
    await req.db.Task.destroy({ where: { id } });
  	res.end();
  });

  // get specific task
  app.get("/task/:id", async (req, res) => {
    const { id } = req.params;
    const task = await req.db.Task.findAll({ where: { id } });
    res.json(task);
  });

	// port
  const port = 3000;
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

main();