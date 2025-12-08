const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ✅ Serve frontend (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "..")));

// ✅ Serve data files
app.use("/data", express.static(path.join(__dirname, "../data")));

// ✅ Save Menus
app.post("/api/update-menus", (req, res) => {
  const menuPath = path.join(__dirname, "../data/menus.json");
  fs.writeFile(menuPath, JSON.stringify(req.body, null, 2), (err) => {
    if (err) {
      console.error("❌ Error writing menus.json:", err);
      return res.status(500).send("Error updating menus");
    }
    res.send("Menus updated");
  });
});

// ✅ Save Popup
// app.post("/api/update-popup", (req, res) => {
//   const popupPath = path.join(__dirname, "../data/popup.json");
//   fs.writeFile(popupPath, JSON.stringify(req.body, null, 2), (err) => {
//     if (err) {
//       console.error("❌ Error writing popup.json:", err);
//       return res.status(500).send("Error updating popup");
//     }
//     res.send("Popup updated");
//   });
// });

// ✅ GET What's On
app.get("/data/whatson.json", (req, res) => {
  const whatsonPath = path.join(__dirname, "../data/whatson.json");
  fs.readFile(whatsonPath, "utf8", (err, data) => {
    if (err) {
      console.error("❌ Error reading whatson.json:", err);
      return res.status(500).send("Error reading data");
    }
    res.setHeader("Content-Type", "application/json");
    res.send(data || "[]");
  });
});

// ✅ ADD What's On
app.post("/api/whatson", (req, res) => {
  const whatsonPath = path.join(__dirname, "../data/whatson.json");
  fs.readFile(whatsonPath, "utf8", (err, data) => {
    const current = JSON.parse(data || "[]");
    current.unshift(req.body); // Add to the top
    fs.writeFile(whatsonPath, JSON.stringify(current, null, 2), (err) => {
      if (err) {
        console.error("❌ Error writing whatson.json:", err);
        return res.status(500).send("Write error");
      }
      res.send("Promotion added");
    });
  });
});

// ✅ DELETE What's On
app.delete("/api/whatson/:index", (req, res) => {
  const whatsonPath = path.join(__dirname, "../data/whatson.json");
  fs.readFile(whatsonPath, "utf8", (err, data) => {
    if (err) return res.status(500).send("Read error");

    const list = JSON.parse(data || "[]");
    const index = parseInt(req.params.index);

    if (index < 0 || index >= list.length) return res.status(400).send("Invalid index");

    list.splice(index, 1);

    fs.writeFile(whatsonPath, JSON.stringify(list, null, 2), (err) => {
      if (err) return res.status(500).send("Write error");
      res.send("Promotion deleted");
    });
  });
});

// ✅ Default route to avoid "Cannot GET /"
app.get("/", (req, res) => {
  res.send("Namour backend is live!");
});

app.listen(PORT, () => {
  console.log(`✅ Admin backend running at http://localhost:${PORT}`);
});
