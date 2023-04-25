const morgan = require("morgan"); // Logs HTTP requests to the console in a clean format
const express = require("express"); // Node.js framework for web
const bodyParser = require("body-parser"); // Parses incoming request bodies in JSON format

require("dotenv").config(); // Library for environment variables

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
  app.use(morgan("tiny"));
  app.use(bodyParser.json());
  app.use(passDbAroundMiddleware(db));

  // get all existing tasks
  app.get("/tasks", async (req, res) => {
    try {
      const tasks = await req.db.Task.findAll();
      res.json(tasks.map((t) => t.toJSON()));
      res.end();
    } catch (error) {
      console.error(error);
      return res.status(500).end();
    }
  });

  // create new task
  app.post("/task", async (req, res) => {
    console.log({ body: req.body });
    const { title, completed } = req.body;

    let data;

    try {
      const task = await req.db.Task.create({ title, completed });
      data = await task.toJSON();
      res.json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).end();
    }
  });

  // update task title
  app.patch("/task/:id/title", async (req, res) => {
    const { title } = req.body;
    const { id } = req.params;

    let data;

    try {
      await req.db.Task.update({ title }, { where: { id } });
      data = { title };
      res.json(data);
    } catch (error) {
      console.log(error);
      return res.status(500).end();
    }
  });

  // update completed status
  app.patch("/task/:id/status", async (req, res) => {
    const { completed } = req.body;
    const { id } = req.params;

    try {
      await req.db.Task.update(
        {
          completed,
        },
        {
          where: { id },
        }
      );
      res.end();
    } catch (error) {
      console.log(error);
      return res.status(500).end();
    }
  });

  // delete task
  app.delete("/task/:id", async (req, res) => {
    const { id } = req.params;

    try {
      await req.db.Task.destroy({
        where: { id },
      });
      res.end();
    } catch (error) {
      console.error(error);
      return res.status(500).end();
    }
  });

  // delete all completed tasks
  app.delete("/tasks/completed", async (req, res) => {
    try {
      await req.db.Task.destroy({
        where: { completed: true },
      });
      res.end();
    } catch (error) {
      console.log(error);
      return res.status(500).end();
    }
  });

  // get specific task
  app.get("/task/:id", async (req, res) => {
    const { id } = req.params;

    try {
      const task = await req.db.Task.findAll({
        where: { id },
      });
      res.json(task);
    } catch (error) {
      console.log(error);
      return res.status(500).end();
    }
  });

  app.use(express.static("frontend"));

  // port
  const port = 3000;
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

main();
