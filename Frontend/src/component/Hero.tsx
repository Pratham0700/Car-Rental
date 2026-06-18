import { ArrowRight, BadgeCheck, CarFront, Gauge } from "lucide-react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const Hero = () => {
  return (
    <section className="overflow-hidden bg-light px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-120px)] max-w-7xl flex-col justify-center">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-medium text-primary shadow-sm">
              <BadgeCheck className="size-4" />
              Trusted car rentals across your city
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-normal text-slate-950 sm:text-5xl lg:text-6xl">
              Find the perfect car for your next ride
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Browse verified cars, compare daily prices, and book a ride that
              fits your plans without the usual rental hassle.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
              <Link
                to="/cars"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-primary-dull"
              >
                Browse cars
                <ArrowRight className="size-5" />
              </Link>
              <Link
                to="/owner/dashboard"
                className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-7 font-semibold text-slate-700 shadow-sm transition hover:border-primary hover:text-primary"
              >
                List your car
              </Link>
            </div>
          </div>

          <div className="relative w-full">
            <div className="absolute inset-x-8 bottom-3 h-16 rounded-full bg-slate-300/70 blur-2xl" />
            <img
              src={assets.main_car}
              alt="Luxury rental car"
              className="relative mx-auto w-full max-w-4xl object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        <div className="mx-auto mt-20 grid w-full max-w-3xl gap-3 sm:grid-cols-3">
          <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
            <CarFront className="size-5 text-primary" />
            Wide fleet
          </div>
          <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
            <Gauge className="size-5 text-primary" />
            Easy booking
          </div>
          <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
            <BadgeCheck className="size-5 text-primary" />
            Verified cars
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
