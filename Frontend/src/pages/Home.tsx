import Hero from "../component/Hero";
import FeatureSelection from "../component/FeatureSelection";
import Banner from "../component/Banner";
import Testimonial from "../component/Testimonial";
import Newsletter from "../component/Newsletter";
import { useEffect } from "react";
import { fetchCars, resetFilters } from "../store/cars/carSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const fetch = async () => {
      dispatch(resetFilters());
      await dispatch(fetchCars());
    };
    fetch();
  }, []);

  return (
    <div>
      <Hero />
      <FeatureSelection />
      <Banner />
      <Testimonial />
      <Newsletter />
    </div>
  );
};

export default Home;
