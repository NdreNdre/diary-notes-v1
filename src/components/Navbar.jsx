import { NavLink } from 'react-router-dom';
import { CgNotes } from "react-icons/cg";
import { IoSearch } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaPlus } from "react-icons/fa";
import { useGlobalContext } from '../context/globalContext';
import hk3 from '../assets/hklogo.png'
import { RiLogoutBoxLine } from "react-icons/ri";

const Navbar = () => {

    const { boxAdd, setBoxAdd, selectedNote } = useGlobalContext();

    const NavItem = ({ to, icon, label, mobile = false }) => (
        <NavLink
            to={to}
            className={({ isActive }) =>
            `${mobile ? 'flex flex-col items-center text-xs' : 'flex items-center space-x-2 px-3 py-2 rounded-lg'} 
            ${isActive ? 'text-white bg-pink-500 py-1 px-6 rounded-full' : 'text-pink-500 hover:text-white hover:bg-pink-500 hover:rounded-full py-1 px-6 hover:py-1 hover:px-6'}`
            }
        >
            {icon}
            {!mobile && <span>{label}</span>}
            {mobile && <span className="text-[10px] mt-1">{label}</span>}
        </NavLink>
        );

    const handleBoxAdd = () => {
        setBoxAdd(true);
    }

     const handleLogout = () => {
        localStorage.removeItem('token');
        // navigate('/')
    }

    return(     
        <>
            {/* Desktop Sidebar */}
            <nav className="hidden lg:flex flex-col w-60 bg-dark-dp2 bg-white/90 shadow shadow-black/30 border-r border-pink-700 text-white p-4 space-y-4">
                <img src={hk3} alt="" className='w-40 h-40 opacity-75'/> 
                <NavItem to="/home" icon={<CgNotes size={20} />} label="Notes" />
                <button onClick={handleLogout}><NavItem to="/" icon={<RiLogoutBoxLine size={20} />} label="Logout" /></button>
                {/* <NavItem to="/Notes" icon={<GiHamburgerMenu size={20} />} label="Setting" /> */}
            </nav>

            {/* Mobile Bottom Navbar */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-dark-dp2 flex justify-around items-center h-20 border-t border-pink-700 z-50 bg-white/90">
                <NavItem to="/home" icon={<CgNotes size={20} />} label="Notes" mobile />
                {/* <NavItem to="/Notes" icon={<IoSearch size={20} />} label="Search" mobile /> */}
                <button onClick={handleLogout}><NavItem to="/" icon={<RiLogoutBoxLine size={20} />} label="Logout" mobile/></button>
                {/* <NavItem to="/Notes" icon={<GiHamburgerMenu size={20} />} label="Setting" mobile /> */}
            </nav>

            {/* Mobile Floating Add Button */}
            {selectedNote?.length == 0 && (<button onClick={() => handleBoxAdd()} className="fixed bottom-24 right-5 bg-pink-500 hover:bg-pink-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-50 border-4 border-white/50">
                <FaPlus size={24} />
            </button>)}
        </>
    )
}

export default Navbar;