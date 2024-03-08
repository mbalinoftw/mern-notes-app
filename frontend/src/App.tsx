import { useState, useEffect } from "react";
import { Note as NoteModel } from "./models/note";
import axios from "axios";
import PageLayout from "./components/PageLayout";
import Note from "./components/Note";

export default function App() {
  const [notes, setNotes] = useState<NoteModel[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data } = await axios("/api/notes");
        setNotes(data);
      } catch (error) {
        console.error(error);
        alert(error);
      }
    };

    fetchNotes();
  }, []);

  return (
    <PageLayout>
      {notes.map((note) => (
        <Note note={note} key={note._id} />
      ))}
    </PageLayout>
  );
}
