import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import { IoSearch } from "react-icons/io5";
import AnimatedList from "../components/AnimatedList";
import { FaCalendarAlt } from "react-icons/fa";
import { FaFilter } from "react-icons/fa";
import { useGlobalContext } from "../context/globalContext";

import TextEditor from "../components/TextEditor";

import hk4 from '../assets/hkstrpng.png'
import hk5 from '../assets/hkpeace2.png'

const HomePage = () => {

    const navigate = useNavigate();

    const { boxAdd, setBoxAdd, contentBody, setContentBody, listNotes, setListNotes, setSelectedNote, fetchListNotes } = useGlobalContext();

    // useEffect(() => {
    //     const token = localStorage.getItem('token');
    //     if(token == null){
    //         navigate('/')
    //         toast.error('Access Denied !');
    //     }
    //     setSelectedNote([]);
    // },[])

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/')
    }

    const handleSubmitNote = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://diary-notes-v1-backend.vercel.app/add-note`, {
                method:'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                 credentials:'include',
                body:JSON.stringify({contentBody}),
            })

            const result = await response.json();

            if(result.success){
                toast.success('Successfully Added Note!');
                await fetchListNotes();
                setBoxAdd(false);
            } else {
                toast.error('Failed To Submit Note : ', result.message);
            }
        } catch (error) {
            console.error('Failed To Submit Note : ', error);
            toast.error('Failed To Submit Note!');
        }
    }

    useEffect(() => {
        fetchListNotes();
    },[])

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [showCategoryFilter, setShowCategoryFilter] = useState(false);
    const [showDateFilter, setShowDateFilter] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const notesPerPage = 10;


    const filteredNotes = listNotes?.filter(note => {
        const title = note.title.toLowerCase();
        const searchWords = searchTerm.toLowerCase().split(' ').filter(word => word.trim() !== '');

        const matchTitle = searchWords.every(word => title.includes(word));
        const matchCategory = selectedCategory ? note.category === selectedCategory : true;
        const matchDate = selectedDate ? note.note_date === selectedDate : true;

        return matchTitle && matchCategory && matchDate;
    });


    const indexOfLastNote = currentPage * notesPerPage;
    const indexOfFirstNote = indexOfLastNote - notesPerPage;
    const currentNotes = filteredNotes?.slice(indexOfFirstNote, indexOfLastNote);
    const totalPages = Math.ceil(filteredNotes?.length / notesPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategory, selectedDate]);


    return(
        <div className="h-full relative">
            {/* <button onClick={() => handleLogout()}>log out</button> */}
            <img src={hk4} alt="" className='w-40 h-40 absolute bottom-20 right-0 opacity-75 lg:hidden'/> 
            <div className="top-section w-full bg-white/90 h-16 flex space-x-1 items-center justify-evenly px-2 absolute z-50 border-b border-pink-700 shadow shadow-black/30">
                <div className="item flex items-center justify-center w-3/4 lg:justify-start lg:px-3 ">
                    <IoSearch className="bg-pink-100 rounded-l-full w-8 h-10 p-2"></IoSearch>
                    <input
                        type="text"
                        className="p-2 outline-none rounded-r-full bg-pink-100 lg:w-1/2"
                        placeholder="Search Notes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="item flex items-center justify-center w-1/4 space-x-3 lg:justify-end lg:px-6">
                    <FaFilter
                        className="text-white font-semibold w-9 h-9 bg-pink-300 hover:bg-pink-500 p-2 rounded-full cursor-pointer"
                        onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                    />
                    <FaCalendarAlt
                        className="text-white font-semibold w-9 h-9 bg-pink-300 hover:bg-pink-500 p-2 rounded-full cursor-pointer"
                        onClick={() => setShowDateFilter(!showDateFilter)}
                    />

                </div>
            </div>
            {showCategoryFilter && (
                <div className="absolute top-20 right-10 bg-white border rounded shadow-lg p-4 z-50">
                    <h2 className="font-semibold mb-2">Filter by Category</h2>
                    <select
                        className="bg-pink-100 p-2 rounded w-full"
                        value={selectedCategory}
                        onChange={(e) => {
                            setSelectedCategory(e.target.value);
                            setShowCategoryFilter(false);
                        }}
                    >
                        <option value="">All</option>
                        <option value="work">Work</option>
                        <option value="ekklesia">Ekklesia</option>
                    </select>
                </div>
            )}

            {showDateFilter && (
                <div className="absolute top-20 right-10 bg-white border rounded shadow-lg p-4 z-50">
                    <h2 className="font-semibold mb-2">Filter by Date</h2>
                    <input
                        type="date"
                        className="bg-pink-100 p-2 rounded w-full"
                        value={selectedDate}
                        onChange={(e) => {
                            setSelectedDate(e.target.value);
                            setShowDateFilter(false);
                        }}
                    />
                    <button
                        className="mt-2 text-sm text-red-500 underline"
                        onClick={() => {
                            setSelectedDate('');
                            setShowDateFilter(false);
                        }}
                    >
                        Clear Date Filter
                    </button>
                </div>
            )}


            <div className="notes-section w-full h-screen bg-white/40 justify-center relative pt-16">
                <div className="item-list h-full overflow-y-scroll flex flex-col justify-between pb-24">
                    <AnimatedList
                        items={currentNotes}
                        onItemSelect={(item, index) => console.log(item, index)}
                        showGradients={false}
                        enableArrowNavigation={true}
                        displayScrollbar={false}
                    />
                    <div className="w-full flex justify-center items-center mt-4 space-x-1">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="bg-pink-200 hover:bg-pink-400 text-white font-semibold px-4 py-1 rounded disabled:opacity-50"
                        >
                            Prev
                        </button>

                        {[...Array(totalPages).keys()].map(n => (
                            <button
                            key={n + 1}
                            onClick={() => setCurrentPage(n + 1)}
                            className={`px-3 py-1 rounded font-semibold ${
                                currentPage === n + 1
                                ? 'bg-pink-500 text-white'
                                : 'bg-white text-pink-600 hover:bg-pink-300'
                            }`}
                            >
                            {n + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="bg-pink-200 hover:bg-pink-400 text-white font-semibold px-4 py-1 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>

                </div>
                
            </div>

            

            <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all ${boxAdd ? 'visible' : 'invisible'}`}>
            {/* Overlay */}
                <div className={`fixed inset-0 bg-black/50 transition-opacity ${boxAdd ? 'visible opacity-100' : 'invisible opacity-0'}`} onClick={() => setBoxAdd(false)} />

                {/* Modal */}
                <div className={`w-full max-w-[80%] lg:max-w-[90vw] lg:min-h-[80vh] p-3 bg-pink-100 rounded-xl shadow-2xl transform transition-all ${boxAdd ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
                    <img src={hk5} alt="" className='w-56 h-40 absolute -top-20 -left-24'/> 
            
                    <div className="title w-full flex justify-center items-center py-2">
                        <h1 className="text-xl font-bold">Add Notes</h1>
                    </div>
                    <div className="content-section flex flex-col space-y-3">
                        <div className="item-input flex flex-col items-start justify-center lg:w-1/2">
                            <label htmlFor="" className="font-semibold">Title</label>
                            <input type="text" className="rounded p-2 w-full text-black bg-pink-200 outline-none shadow-inner shadow-black/10" onChange={(e) => setContentBody(prev => ({
                                ...prev,
                                title:e.target.value
                            }))}/>
                        </div>
                        <div className="item-input flex flex-col items-start justify-center lg:w-1/4">
                            <label htmlFor="" className="font-semibold">Date</label>
                            <input type="date" className="rounded p-2 w-full text-black bg-pink-200 outline-none shadow-inner shadow-black/10" onChange={(e) => setContentBody(prev => ({
                                ...prev,
                                date:e.target.value
                            }))}/>
                        </div>
                        <div className="item-input flex flex-col items-start justify-center lg:w-1/4">
                            <label htmlFor="">Category</label>
                            <select name="" id="" className="rounded p-2 w-full text-black bg-pink-200 outline-none shadow-inner shadow-black/10" onChange={(e) => setContentBody(prev => ({
                                ...prev,
                                category:e.target.value
                            }))}>
                                <option value="work">Work</option>
                                <option value="ekklesia">Ekklesia</option>
                            </select>
                        </div>

                        <div className="item-input">
                            <label htmlFor="">Notes : </label>
                            <TextEditor></TextEditor>
                        </div>

                        {/* <div className="item-input">
                            <label htmlFor="">Attachment : (Coming Soon) </label>
                            <input type="file" />
                        </div> */}

                        <button onClick={(e) => handleSubmitNote(e)} className="w-full text-center p-3 rounded bg-pink-400 hover:bg-pink-600 font-semibold text-white">
                            Save
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default HomePage;