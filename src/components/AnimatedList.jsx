import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaRegCalendarAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../context/globalContext';

const AnimatedItem = ({ children, delay = 0, index, onMouseEnter, onClick }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.5, triggerOnce: false });
  

  return (
    <motion.div
      ref={ref}
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.2, delay }}
      className="mb-4 cursor-pointer"
    >
      {children}
    </motion.div>
  );
};

const AnimatedList = ({
  items,
  onItemSelect,
  showGradients = true,
  enableArrowNavigation = true,
  className = '',
  itemClassName = '',
  displayScrollbar = true,
  initialSelectedIndex = -1,
}) => {
  const listRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);
  const [keyboardNav, setKeyboardNav] = useState(false);
  const [topGradientOpacity, setTopGradientOpacity] = useState(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState(1);
  const navigate = useNavigate();

  const { selectedNote, setSelectedNote } = useGlobalContext();

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    setTopGradientOpacity(Math.min(scrollTop / 50, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(
      scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1)
    );
  };

  useEffect(() => {
    if (!enableArrowNavigation) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1));
      } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          e.preventDefault();
          if (onItemSelect) {
            onItemSelect(items[selectedIndex], selectedIndex);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, selectedIndex, onItemSelect, enableArrowNavigation]);

  useEffect(() => {
    if (!keyboardNav || selectedIndex < 0 || !listRef.current) return;
    const container = listRef.current;
    const selectedItem = container.querySelector(`[data-index="${selectedIndex}"]`);
    if (selectedItem) {
      const extraMargin = 50;
      const containerScrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const itemTop = selectedItem.offsetTop;
      const itemBottom = itemTop + selectedItem.offsetHeight;
      if (itemTop < containerScrollTop + extraMargin) {
        container.scrollTo({ top: itemTop - extraMargin, behavior: 'smooth' });
      } else if (itemBottom > containerScrollTop + containerHeight - extraMargin) {
        container.scrollTo({
          top: itemBottom - containerHeight + extraMargin,
          behavior: 'smooth',
        });
      }
    }
    setKeyboardNav(false);
  }, [selectedIndex, keyboardNav]);

  function formatTimestamp(isoString) {
    const date = new Date(isoString);

    const options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    };

    return date.toLocaleString('en-GB', options).replace(',', '');
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

  function formatDateToReadable(dateString) {
    const date = new Date(dateString);

    const day = date.getDate();
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  }

  const handleSelectNote = (e,item) => {
    e.preventDefault();
    setSelectedNote(item);
    navigate('/detail-note');
  }

  return (
    <div className={`relative ${className}`}>
      <div
        ref={listRef}
        className={`h-full overflow-y-auto p-4 ${
          displayScrollbar
            ? "[&::-webkit-scrollbar]:w-[8px] [&::-webkit-scrollbar-track]:bg-[#060010] [&::-webkit-scrollbar-thumb]:bg-[#222] [&::-webkit-scrollbar-thumb]:rounded-[4px]"
            : "scrollbar-hide"
        }`}
        onScroll={handleScroll}
        style={{
          scrollbarWidth: displayScrollbar ? "thin" : "none",
          scrollbarColor: "#222 #060010",
        }}
      >
        {!items || items.length === 0 ? (
          <div className="text-center text-gray-500 py-10 bg-white rounded-xl ">
            <p>Please insert note</p>
          </div>
          ) : (
            items.map((item, index) => (
              <AnimatedItem
                key={index}
                delay={0.1}
                index={index}
                onMouseEnter={() => setSelectedIndex(index)}
                onClick={(e) => handleSelectNote(e, item)}
              >
                <div className={`p-4 shadow shadow-pink-800/20 flex flex-col space-y-2 bg-white rounded-lg relative hover:bg-pink-200 overflow-hidden ${selectedIndex === index ? 'bg-pink-100' : ''} ${itemClassName}`}>
                  <h1 className='font-bold text-xl mt-3 lg:mt-0'>{item.title}</h1>
                  <h1 className='flex items-center justify-start space-x-1 text-sm text-[#E91E63]'>
                    <FaRegCalendarAlt />
                    <span>{formatDateToReadable(item.note_date)}</span>
                  </h1>
                  <h1 className='absolute right-3 bottom-3 font-semibold'>#{item.category}</h1>
                  <p className='text-sm text-gray-500/70 px-3 font-light absolute right-0 top-0'>{formatToWIB(item.updated_at)}</p>
                </div>
              </AnimatedItem>
            ))
          )}

      </div>
      {showGradients && (
        <>
          <div
            className="absolute top-0 left-0 right-0 h-[50px] bg-gradient-to-b from-pink-300 to-transparent pointer-events-none transition-opacity duration-300 ease"
            style={{ opacity: topGradientOpacity }}
          ></div>
          <div
            className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-pink-300 to-transparent pointer-events-none transition-opacity duration-300 ease"
            style={{ opacity: bottomGradientOpacity }}
          ></div>
        </>
      )}
    </div>
  );
};

export default AnimatedList;
