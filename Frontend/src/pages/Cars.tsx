import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import Title from "../component/Title";
import { assets } from "../assets/assets";
import CarCard from "../component/CarCard";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { fetchCars, setPage, setSearch, resetFilters, carSlice,  } from "../store/cars/carSlice";
import NoCar from "../component/NoCar";

const Cars = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const prevLocationRef = useRef(location.pathname);
  const [search, setsearch] = useState("");
  const CarsSlice = useSelector((state: RootState) => state.cars);
  const car = CarsSlice.cars;
useEffect(() => {
  if(CarsSlice.search){
    setsearch(CarsSlice.search)
  }
}, [])

  
  useEffect(() => {
    const fetch = async()=>{
    await  dispatch(fetchCars());
    }
    fetch();
  }, [dispatch, CarsSlice.page, CarsSlice.search]);

  useEffect(() => {
    if(CarsSlice.cars.length===0)
    {
      if(CarsSlice.page>CarsSlice.totalPages)
      {
        
      dispatch(setPage(CarsSlice.totalPages));
      }
    }
  }, [CarsSlice.cars])
  

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const normalizedSearch = search.trim();
      const currentSearch = CarsSlice.search ?? "";

      if (normalizedSearch !== currentSearch) {
        dispatch(setSearch(normalizedSearch === "" ? null : normalizedSearch));
      }
    }, 1000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [dispatch, search, CarsSlice.search]);

  const handlePrevPage = () => {
    if (CarsSlice.page > 1) {
      dispatch(setPage(CarsSlice.page - 1));
    }
  };

  const handleNextPage = () => {
    if (CarsSlice.page < CarsSlice.totalPages) {
      dispatch(setPage(CarsSlice.page + 1));
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center py-12 bg-light max-md:px-4">
        <Title
          title="Available Cars"
          subtitle="Browse our selection of premium vehicles available for your next adventure"
        />
        <div className="flex items-center px-4 mt-6 max-w-140 w-full bg-white rounded-full h-12 shadow">
          <img
            src={assets.search_icon}
            alt="search icon"
            className="w-4.5 h-4.5 mr-2"
          />
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setsearch(e.target.value)
            }
            value={search}
            type="text"
            placeholder="Search by brand, model or city"
            className=" cursor-pointer w-full h-full text-gray-500 outline-none"
          />
          <img
            src={assets.filter_icon}
            alt="search icon"
            className="w-4.5 h-4.5 ml-2"
          />
        </div>
      </div>

      {car.length>0?<div className="mt-10 px-6 md:px-16 lg:px-24 xl:px-32 ">
        <p className="text-gray-500 pb-3">Showing {car.length} Cars</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 ">
          {car.map((car) => (
            <div key={car.id} className="">
              <CarCard car={car} />
            </div>
          ))}
        </div>

        {CarsSlice.totalPages > 0 && (
          <div className="flex flex-col items-center justify-between gap-4 mt-10 sm:flex-row">
            <p className="text-gray-500">
              Page {CarsSlice.page} of {CarsSlice.totalPages}
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrevPage}
                disabled={CarsSlice.page <= 1}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleNextPage}
                disabled={CarsSlice.page >= CarsSlice.totalPages}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>:<NoCar/>}
    </div>
  );
};

export default Cars;
