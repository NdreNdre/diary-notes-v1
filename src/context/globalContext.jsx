import { createContext, useContext, useState, useEffect } from "react";

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
    const [listNotes, setListNotes] = useState([]);
    const [boxAdd, setBoxAdd] = useState(false);
    const [noteContent, setNoteContent] = useState('');
    const [noteTitle, setNoteTitle] = useState('');
    const [noteDate, setNoteDate] = useState('');
    const [noteCategory, setNoteCategory] = useState('work');

    const [contentBody, setContentBody] = useState({
        title:'',
        date:'',
        category:'work',
        content:'',
    })

    const [selectedNote, setSelectedNote] = useState([]);

    const fetchListNotes = async () => {
        try {
            const response = await fetch(`https://diary-notes-v1-backend.vercel.app/list-note`);
            const result = await response.json();
            setListNotes(result.notes);
        } catch (error) {
            console.error('Failed To Fetch Notes : ', error);
        }
    }
    
    useEffect(() => {
        fetchListNotes();
    },[])

    return (
        <GlobalContext.Provider value={{ 
            boxAdd, 
            setBoxAdd,
            contentBody,
            setContentBody,
            selectedNote,
            setSelectedNote,
            listNotes,
            setListNotes,
            fetchListNotes,
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => useContext(GlobalContext);
