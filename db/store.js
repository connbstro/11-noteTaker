const util = require("util");
const fs = require("fs");

// Import uuid package for id's.
const { uuid } = require("uuidv4");

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

class Store {
  read() {
    return readFileAsync("db/db.json", "utf-8");
  }

  write(note) {
    return writeFileAsync("db/db.json", JSON.stringify(note));
  }

  getNotes() {
    return this.read().then((notes) => {
      // Return an array of the notes.
      return [].concat(JSON.parse(notes));
    });
  }

  addNote(note) {
    // Destructure title and text.
    const { title, text } = note;

    // Adding uuid to note.
    const newNote = { title, text, id: uuid() };

    // Get all the notes, add the new notes, write all the updated notes, return newNote.
    return this.getNotes()
      .then((notes) => [...notes, newNote])
      .then((updatedNotes) => this.write(updatedNotes))
      .then(() => newNote);
  }

  removeNote(id) {
    // Get all notes, remove the note with given id, write the filtered notes.
    return this.getNotes()
      .then((notes) => notes.filter((note) => note.id !== id))
      .then((filteredNotes) => this.write(filteredNotes));
  }
}

module.exports = new Store();
