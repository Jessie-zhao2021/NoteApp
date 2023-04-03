import React from "react"
import { useState, useEffect } from 'react'

import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
// import { data } from "./data"
import Split from "react-split"
import {nanoid} from "nanoid"
import './App.css'

function App() {
  const[notes, setNotes] = useState( () => JSON.parse(localStorage.getItem("notes"))|| [])
  
  const[currentNoteId, setCurrentNoteId] = useState((notes[0] && notes[0].id) || "")
  
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes))
  }, [notes])

  function createNewNote(){
    const newNote = {
              id : nanoid(),
              body : "# Type your markdown note's title here"
    }
    setNotes(prevNotes => [newNote, ...prevNotes])
    setCurrentNoteId(newNote.id)
    return;
  }

  function updateNote(text){
    setNotes(prevNotes=>{
       const newArray = []
       for (let i=0; i<prevNotes.length; i++){
           if (prevNotes[i].id === currentNoteId){
             newArray.unshift({...prevNotes[i], body : text})
           } else{newArray.push(prevNotes[i])}
       }
       return newArray
      })
  }
  function deleteNote(event, noteId){
      event.stopPropagation()
      setNotes(prevNotes=>prevNotes.filter(note => note.id !==noteId))
  }

  function findCurrentNote(){
      return notes.find((note) => note.id === currentNoteId) || notes[0]
  }

  return (
    <main>
    {
       notes.length > 0
       ?
       <Split
           sizes={[30,70]}
           direction="horizontal"
           className="split"
       >  
          <Sidebar 
              notes={notes}
              currentNote={findCurrentNote()}
              setCurrentNoteId={setCurrentNoteId}
              newNote={createNewNote}
              deleteNote={deleteNote}
          />
          {currentNoteId && notes.length > 0 &&
             <Editor 
                 currentNote={findCurrentNote()}
                 updateNote={updateNote}
             />
          }
       
       </Split>
       :
       <div className="no-notes">
          <h1>You have no notes</h1>
          <button
              className="first-note"
              onClick={createNewNote}
          >
            Create one now
          </button>
       </div>
    }   
    </main>
  )
}

export default App
