import { useGlobalContext } from "../context/globalContext";
// src/components/MyEditor.jsx
import { useEditor, EditorContent } from '@tiptap/react'
import { EditorProvider, useCurrentEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import Image from '@tiptap/extension-image'
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import { FaTrash } from "react-icons/fa";

const DetailNotePage = () => {

    const { selectedNote } = useGlobalContext();

    const [currentNote, setCurrentNote] = useState(selectedNote);

    const navigate = useNavigate();

    const editor = useEditor({
        extensions: [StarterKit, Image],
        content: `${selectedNote.content}`,
        onUpdate: ({ editor }) => {
            setCurrentNote(prev => ({
                ...prev,
                content:editor.getHTML()
            }))
        },
    })

    const MenuBar = ({ editor }) => {
        if (!editor) return null

        const buttonStyle = "px-3 py-1 border rounded mr-2 text-sm font-medium hover:bg-pink-300 transition"

        const handleImageUpload = () => {
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = 'image/*'
            input.onchange = async () => {
                const file = input.files?.[0]
                if (file) {
                const reader = new FileReader()
                reader.onload = () => {
                    const base64 = reader.result
                    editor
                    .chain()
                    .focus()
                    .setImage({ src: base64 })
                    .run()
                }
                reader.readAsDataURL(file)
                }
            }
            input.click()
        }

        return (
            <div className="flex flex-wrap gap-1">
            <button
                onMouseDown={e => e.preventDefault()}
                className={`${buttonStyle} ${editor.isActive('bold') ? 'bg-pink-400' : 'bg-pink-200'}`}
                onClick={() => editor.chain().focus().toggleBold().run()}
            >
                Bold
            </button>
            <button
                onMouseDown={e => e.preventDefault()}
                className={`${buttonStyle} ${editor.isActive('italic') ? 'bg-pink-400' : 'bg-pink-200'}`}
                onClick={() => editor.chain().focus().toggleItalic().run()}
            >
                Italic
            </button>
            {/* <button
                onMouseDown={e => e.preventDefault()}
                className={`${buttonStyle} ${editor.isActive('heading', { level: 1 }) ? 'bg-pink-400' : 'bg-pink-200'}`}
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            >
                H1
            </button> */}
            {/* <button
                onMouseDown={e => e.preventDefault()}
                className={`${buttonStyle} ${editor.isActive('heading', { level: 2 }) ? 'bg-pink-400' : 'bg-pink-200'}`}
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
                H2
            </button> */}
            <button
                onMouseDown={e => e.preventDefault()}
                className={`${buttonStyle} ${editor.isActive('bulletList') ? 'bg-pink-400' : 'bg-pink-200'}`}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
                Bullet
            </button>
            <button
                onMouseDown={e => e.preventDefault()}
                className={`${buttonStyle} ${editor.isActive('orderedList') ? 'bg-pink-400' : 'bg-pink-200'}`}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
                Number
            </button>
            {/* <button
                onMouseDown={e => e.preventDefault()}
                className={buttonStyle}
                onClick={() => editor.chain().focus().undo().run()}
            >
                Undo
            </button>
            <button
                onMouseDown={e => e.preventDefault()}
                className={buttonStyle}
                onClick={() => editor.chain().focus().redo().run()}
            >
                Redo
            </button> */}
            <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleImageUpload}
                className="px-3 py-1 border rounded mr-2 text-sm font-medium bg-pink-200 hover:bg-pink-300 transition"
                >
                Upload Image
            </button>
            </div>
        )
    }

    function formatToWIB(isoString) {
        const utcDate = new Date(isoString);

        // Convert to UTC+7 manually
        const wibOffsetMs = 7 * 60 * 60 * 1000;
        const wibDate = new Date(utcDate.getTime() + wibOffsetMs);

        const day = wibDate.getDate();
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const month = monthNames[wibDate.getMonth()];
        const year = wibDate.getFullYear();

        const hours = String(wibDate.getHours()).padStart(2, '0');
        const minutes = String(wibDate.getMinutes()).padStart(2, '0');
        const seconds = String(wibDate.getSeconds()).padStart(2, '0');

        return `${day} ${month} ${year}, ${hours}:${minutes}:${seconds}`;
    }


    const handleUpdateNote = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://diary-notes-v1-backend.vercel.app/update-note/${currentNote?.id}`, {
                method:'PUT',
                headers:{
                    'Content-Type': 'application/json',
                },
                 credentials:'include',
                body:JSON.stringify({currentNote}),
            })

            console.log(response);

            const result = await response.json();

            if(result.success){
                toast.success('Successfully Update Note!');
                navigate('/home');
            } else {
                toast.error('Failed To Update Note : ', result.message);
            }
        } catch (error) {
            console.error('Failed To Update Note : ', error);
            toast.error('Failed To Update Notes!');
        }
    }

    // const handleDeleteNote = async (id) => {
    //     try {
    //         const response = await fetch(`https://diary-notes-v1-backend.vercel.app/delete-note/${id}`, {
    //             method: 'DELETE',
    //         });

    //         const result = await response.json();

    //         if (result.success) {
    //             toast.success('Note deleted!');
    //            navigate('/home')
    //         } else {
    //             toast.error(result.message || 'Failed to delete note');
    //         }
    //     } catch (error) {
    //         console.error('Error deleting note:', error);
    //         toast.error('Error deleting note!');
    //     }
    // };


    useEffect(() => {
        setCurrentNote(selectedNote);
    },[selectedNote])

    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    const confirmDeleteNote = (id) => {
        setConfirmDeleteId(id); // show the popup
    };

    const handleDeleteNote = async () => {
        try {
            const response = await fetch(`https://diary-notes-v1-backend.vercel.app/delete-note/${confirmDeleteId}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (result.success) {
                toast.success('Note deleted!');
                navigate('/home')
            } else {
                toast.error(result.message || 'Failed to delete note');
            }
        } catch (error) {
            console.error('Error deleting note:', error);
            toast.error('Error deleting note!');
        } finally {
            setConfirmDeleteId(null); // hide popup
        }
    };
    
    return(
        <div className="wrapper w-full h-screen p-5">
            <div className="canpas rounded-2xl bg-white/90 shadow-xl shadow-pink-800/30 w-full min-h-[85vh] lg:h-full">
                <div className="body-content p-3 flex flex-col space-y-1 items-center h-full justify-evenly relative">
                    <h2 className="text-2xl font-bold text-pink-700 flex items-center">
                        Detail Note
                    </h2>
                    <button className="absolute top-4 right-4 text-white rounded-full p-2 bg-pink-400 hover:bg-pink-600" onClick={() => confirmDeleteNote(currentNote?.id)}><FaTrash></FaTrash></button>
                    <div className="detail-creation flex flex-col justify-start items-start w-full text-sm text-pink-700/50">
                        <h1>Created At : {formatToWIB(currentNote?.created_at)}</h1>
                        <h1>Last Modified : {formatToWIB(currentNote?.updated_at)}</h1>
                    </div>
                    <div className="item-list flex items-start justify-start flex-col space-y-1 w-full">
                        <label htmlFor="" className="font-semibold text-pink-800 text-xl">Title</label>
                        <input type="text" className="w-full lg:w-1/2 outline-none rounded p-2 shadow-inner shadow-pink-800/10 bg-pink-100" value={currentNote?.title} onChange={(e) => setCurrentNote(prev => ({
                            ...prev,
                            title:e.target.value
                        }))}/>
                    </div>
                    <div className="item-list flex items-start justify-start flex-col space-y-1 w-full">
                        <label htmlFor="" className="font-semibold text-pink-800 text-xl">Date</label>
                        <input type="date" className="w-full lg:w-1/2 outline-none rounded p-2 shadow-inner shadow-pink-800/10 bg-pink-100" value={currentNote?.note_date} onChange={(e) => setCurrentNote(prev => ({
                            ...prev,
                            note_date:e.target.value
                        }))}/>
                    </div>
                     <div className="item-list flex items-start justify-start flex-col space-y-1 w-full">
                        <label htmlFor="" className="font-semibold text-pink-800 text-xl">Category</label>
                        <select name="" id="" className="w-full lg:w-1/2 outline-none rounded p-2 shadow-inner shadow-pink-800/10 bg-pink-100" value={currentNote?.category} onChange={(e) => setCurrentNote(prev => ({
                            ...prev,
                            category:e.target.value
                        }))}>
                            <option value="work">Work</option>
                            <option value="ekklesia">Ekklesia</option>
                        </select>
                    </div>
                    
                    <div className="item-list flex items-start justify-start flex-col space-y-1 w-full">
                        <h1>Notes :</h1>
                        <div className='flex flex-col space-y-2 w-full'>
                            <MenuBar editor={editor} />
                            <div className="border border-pink-300 rounded py-4 px-2 bg-pink-100 shadow-inner shadow-pink-800/10 lg:min-h-64 lg:max-h-64 max-h-36 overflow-y-scroll w-full">
                                <EditorContent editor={editor} className="ProseMirror" />
                            </div>
                        </div>
                    </div>

                    <button onClick={(e) => handleUpdateNote(e)} className="w-full rounded p-2 text-white bg-pink-400 hover:bg-pink-500">Save</button>
                    
                </div>
 
            </div>

            {confirmDeleteId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center space-y-4">
                        <h2 className="text-lg font-bold text-pink-600">Delete Note?</h2>
                        <p className="text-sm text-gray-600">Are you sure you want to delete this note? This action cannot be undone.</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteNote}
                                className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

        // <div className="bg-pink-100 rounded-2xl shadow-lg p-6 w-full h-screen">
        // <h2 className="text-2xl font-bold text-pink-700 mb-4 flex items-center">
        //     {/* <img src="..\src\assets\hkpeace2.png" alt="Hello Kitty" className="w-12 h-12 mr-2" /> */}
        //     Detail Note
        // </h2>

        // <div className="space-y-3 text-pink-800">
        //     <p><strong>Title:</strong> <span className="ml-2 text-black">My Cute Title</span></p>
        //     <p><strong>Date:</strong> <span className="ml-2 text-black">18 June 2025</span></p>
        //     <p><strong>Category:</strong> <span className="ml-2 text-black">Daily</span></p>

        //     <div>
        //     <label className="font-semibold">Notes:</label>
        //     <div className="flex flex-wrap gap-2 my-2">
        //         <button className="bg-pink-300 text-white px-3 py-1 rounded-lg hover:bg-pink-400">Bold</button>
        //         <button className="bg-pink-300 text-white px-3 py-1 rounded-lg hover:bg-pink-400">Italic</button>
        //         <button className="bg-pink-300 text-white px-3 py-1 rounded-lg hover:bg-pink-400">Bullet</button>
        //         <button className="bg-pink-300 text-white px-3 py-1 rounded-lg hover:bg-pink-400">Number</button>
        //         <button className="bg-fuchsia-300 text-white px-3 py-1 rounded-lg hover:bg-fuchsia-400">Upload Image</button>
        //     </div>

        //     <textarea
        //         className="w-full h-60 p-4 rounded-xl bg-pink-200 border border-pink-300 text-black resize-none"
        //         placeholder="Write your adorable notes here..."
        //         value={"undefined" /* replace with real content */}
        //         readOnly
        //     />
        //     </div>
        // </div>
        // </div>
    )
}

export default DetailNotePage;