import { useState, useEffect } from "react";
import { Note } from "./models/note";
import axios from "axios";

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data } = await axios("/api/notes");
        setNotes(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotes();
  }, []);

  return <div>
    <ul className="">
      {notes.map(note => (
        <li key={note._id} className="">
          <h3 className="">{note.title}</h3>
          <p className="">{note.text}</p>
          <span className="">{note.createdAt}</span>
        </li>
      ))}
    </ul>
  </div>;
}
