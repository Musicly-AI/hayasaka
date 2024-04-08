'use client'
import React, { useState } from 'react';
import { FiArrowUpCircle  } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setIsTyping } from '@/redux/features/loadingBarSlice';
import { toast } from 'react-hot-toast';
import { submitSunoSong } from '@/services/dataAPI';
import { setReload } from '@/redux/features/reloadHomePageDataSlice';


const Searchbar = () => {
  const ref = React.useRef(null);
  const dispatch = useDispatch();
  const router = useRouter();
  // const [searchTerm, setSearchTerm] = useState('');
  const [sunoUrl, setSunoUrl] = useState('');

  const handleSubmit = async (e) => {
    if (sunoUrl === '') {
      e.preventDefault();
      return;
    }
    e.preventDefault();

    // check if the URL is a valid Suno URL
    const regex = /^https:\/\/app\.suno\.ai\/song\/([a-z0-9-]+)\/$/;
    const match = sunoUrl.match(regex);
    if (!match) { 
      toast.error('Please enter a valid Suno URL.');
      return;
    }

    const id = match[1];
    console.log('id', id);

    const resData = await submitSunoSong(id);
    if (resData.success) {
      toast.success('Submitted successfully.');
      setSunoUrl('');
      dispatch(setReload(true));
    } else {
      toast.error(resData.message);
    }
  };
  const handleFocus = () => {
    dispatch(setIsTyping(true));
  };
  const handleBlur = () => {
    dispatch(setIsTyping(false));
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off" className="p-2 text-gray-400 relative focus-within:text-gray-600">
      <label htmlFor="search-field" className="sr-only">
        Submit a Suno song using the Suno URL.
      </label>
      <div className="flex flex-row justify-start items-center">
        <input
        onFocus={handleFocus}
        onBlur={handleBlur}
          name="search-field"
          autoComplete="off"
          id="search-field"
          className="flex-1 bg-transparent w-[360px] focus:border-b border-white  placeholder-gray-300 outline-none text-base text-white p-4"
          placeholder="Submit a Suno song using the Suno URL."
          type="text"
          value={sunoUrl}
          onChange={(e) => setSunoUrl(e.target.value)}
        />
        <FiArrowUpCircle aria-hidden="true" onClick={handleSubmit} className="w-5 h-5 ml-4 text-gray-300 cursor-pointer" />
      </div>
    </form>
  );
};

export default Searchbar;