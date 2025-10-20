import express from "express";
import fs from "fs";

const app = express();
app.use(express.json());

let tabs = JSON.parse(fs.existsSync("tabs.json") ? fs.readFileSync("tabs.json") : "[]");

app.post("/api/tabs", (req, res) => {
  const { titre, accords } = req.body;
  const id = Date.now().toString();
  const newTab = { id, titre, accords };

  tabs.push(newTab);
  fs.writeFileSync("tabs.json", JSON.stringify(tabs, null, 2));

  res.json({ id });
});

app.get("/tab/:id", (req, res) => {
  const tab = tabs.find(t => t.id === req.params.id);
  if (!tab) return res.status(404).send("Tablature non trouvée");
  
  res.send(`
    <html><body>
      <h1>${tab.titre}</h1>
      <pre>${tab.accords.join(" - ")}</pre>
      <a href="/">Retour</a>
    </body></html>
  `);
});

app.listen(3000, () => console.log("Serveur lancé sur http://localhost:3000"));
