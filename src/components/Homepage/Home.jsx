"use client";
import { homePageData, newHomePageData } from "@/services/dataAPI";
import React from "react";
import { useEffect, useState } from "react";
import { SwiperSlide } from "swiper/react";
import SongCard from "./SongCard";
import { useDispatch, useSelector } from "react-redux";
import SwiperLayout from "./Swiper";
import { setProgress } from "@/redux/features/loadingBarSlice";
import SongCardSkeleton from "./SongCardSkeleton";
import { GiMusicalNotes } from 'react-icons/gi'
import SongBar from "./SongBar";
import OnlineStatus from "./OnlineStatus";
import ListenAgain from "./ListenAgain";
import { setReload } from "@/redux/features/reloadHomePageDataSlice";


const Home = () => {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { activeSong, isPlaying, } = useSelector((state) => state.player);
  const { languages } = useSelector((state) => state.languages);
  const { reload } = useSelector((state) => state.reloadHomePageData);

  // salutation
  const currentTime = new Date();
  const currentHour = currentTime.getHours();

  let salutation = '';
  if (currentHour >= 5 && currentHour < 12) {
    salutation = 'Good morning';
  } else if (currentHour >= 12 && currentHour < 18) {
    salutation = 'Good afternoon';
  } else {
    salutation = 'Good evening';
  }

  const fetchData = async () => {
    dispatch(setProgress(70))
    setData("")
    setLoading(true);
    const res = await newHomePageData(languages);
    setData(res);
    dispatch(setProgress(100))
    setLoading(false);
    dispatch(setReload(false))
  };

  useEffect(() => {
    fetchData();
  }, [languages]);

  useEffect(() => {
    if (!reload) {
      return;
    }

    fetchData();
  }, [reload]);



  return (
    <div>
      <OnlineStatus />
      <h1 className='text-4xl font-bold mx-2 m-9 text-white flex gap-2'>"{salutation}  <GiMusicalNotes />"</h1>

      {/* <ListenAgain /> */}

      {/* Recommended list */}
      <SwiperLayout title={"Recommended list"} showNav={false}>
        {
          loading ? (
            <SongCardSkeleton />
          ) : (
            <>
              {data?.recommendList?.map(
                (list) =>
                (
                  <SwiperSlide key={list?.id}>
                    <SongCard song={list} activeSong={activeSong} isPlaying={isPlaying} />
                  </SwiperSlide>
                )
              )}
            </>
          )
        }
      </SwiperLayout>

      {/* monthly trending */}
      <div className="my-4 lg:mt-14">
        <h2 className=" text-white mt-4 text-2xl lg:text-3xl font-semibold mb-4 ">Monthly Trending</h2>
        <div className="grid lg:grid-cols-2 gap-x-10 max-h-96 lg:max-h-full lg:overflow-y-auto overflow-y-scroll">
          {
            loading ? (
              <div className=" w-[90vw] overflow-x-hidden">
                <SongCardSkeleton />
              </div>
            ) : (
              data?.monthlyList?.map(
                (list, index) =>
                (
                  <SongBar key={list?.id} playlist={list} i={index} />
                ))
            )
          }
        </div>
      </div>

      {/* Weekly Trending */}
      <SwiperLayout title={"Weekly Trending"}>
        {
          loading ? (
            <SongCardSkeleton />
          ) : (
            data?.weeklyList?.map(
              (list) =>
              (
                <SwiperSlide key={list?.id}>
                  <SongCard key={list?.id} song={list} activeSong={activeSong} isPlaying={isPlaying} />
                </SwiperSlide>
              )
            )
          )
        }
      </SwiperLayout>

      {/* New Releases */}
      <SwiperLayout title={"New Releases"}>
        {
          loading ? (
            <SongCardSkeleton />
          ) : (
            data?.songs?.map(
              (song) =>
              (
                <SwiperSlide key={song?.id}>
                  <SongCard song={song} activeSong={activeSong} isPlaying={isPlaying} />
                </SwiperSlide>
              )
            )
          )
        }
      </SwiperLayout>

    </div>
  );
};

export default Home;