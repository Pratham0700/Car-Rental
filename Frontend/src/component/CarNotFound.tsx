import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const CarNotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center px-6 py-12 bg-light">
      <div className="max-w-xl w-full bg-white border border-gray-200 shadow-2xl rounded-[2rem] p-10 text-center">
        <div className="mx-auto mb-8 inline-flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm">
          <img src={assets.cautionIconColored} alt="No car found" className="h-12 w-12" />
        </div>
        <p className="text-sm uppercase tracking-[0.3em] text-primary font-semibold mb-4">Oops, no car matches</p>
        <h1 className="text-4xl font-semibold text-gray-900 mb-4">Car not found</h1>
        <p className="text-gray-500 text-base leading-7 mb-8">
          We could not locate the car you were looking for. It may have been removed, or the link may be incorrect.
          Browse available cars or return to the homepage to continue searching.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate('/cars')}
            className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-white text-sm font-semibold transition hover:bg-primary-dull"
          >
            Browse cars
          </button>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-8 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            Return home
          </button>
        </div>
      </div>
    </div>
  )
}

export default CarNotFound
