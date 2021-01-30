const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();

const PORT = process.env.PORT || 3000;
const dbPath = path.join(__dirname, 'db/db.json');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, './public')));

app.get('/api/notes', (req, res) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }
    res.json(JSON.parse(data));
  });
});

app.post('/api/notes', (req, res) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    const notes = JSON.parse(data);
    const newNote = req.body;
    newNote.id = new Date().getTime();
    notes.push(newNote);
    fs.writeFile(dbPath, JSON.stringify(notes), (err) => {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }
      res.json(newNote);
    });
  });
});

app.delete('/api/notes/:id', (req, res) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    const notes = JSON.parse(data);
    const filteredNotes = notes.filter(note => note.id != req.params.id);
    fs.writeFile(dbPath, JSON.stringify(filteredNotes), (err) => {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }
      res.end();
    });
  });
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});