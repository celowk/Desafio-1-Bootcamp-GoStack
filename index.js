//  import express
const express = require("express");

const server = express();
server.use(express.json());

const projects = [
  {
    id: 10,
    title: "project 0",
    tasks: ["hakuna matata"]
  },
  {
    id: 11,
    title: "project 1",
    tasks: []
  },
  {
    id: 12,
    title: "project 2",
    tasks: []
  }
];

let qtdReq = 0;

//  Tempo Requisição
//  Número de requisições
server.use((req, res, next) => {
  qtdReq++;
  console.time(`Requisição`);

  console.log(
    `Requisições: ${qtdReq} | Metodo: ${req.method} | URL: ${req.url}`
  );

  next();
  console.timeEnd(`Requisição`);
});

function checkProjectExists(req, res, next) {
  if (projects.map(e => e.id).indexOf(parseInt(req.params.id)) === -1) {
    return res.status(400).json({ error: "This Project non ecziste!" });
  }
  return next();
}

//List Projects
server.get("/projects/", (req, res) => {
  return res.json(projects);
});

//Add Project
server.post("/projects/", (req, res) => {
  const { id, title } = req.body;
  projects.push({ id: parseInt(id), title: title, tasks: [] });

  return res.json(projects);
});

//Add tasks
server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const projectID = projects.map(e => e.id).indexOf(parseInt(id));

  projects[projectID].tasks.push(title);

  return res.json(projects);
});

//Update projects
// Alterar apeanas o titulo do projeto
server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { title } = req.body;
  const { id } = req.params;

  const projectID = projects.map(e => e.id).indexOf(parseInt(id));

  projects[projectID].title = title;
  return res.json(projects);
});

//Delete project
server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectID = projects.map(e => e.id).indexOf(parseInt(id));

  projects.splice(projectID, 1);
  return res.json(projects);
});

server.listen(3000);
