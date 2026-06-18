import {  CarIcon } from 'lucide-react';
import React from 'react'

const NoCar = () => {
   return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center mb-8">
        <CarIcon className="w-12 h-12 text-gray-400" />
      </div>
      <h2 className="text-2xl font-medium text-gray-900 mb-3">No cars available</h2>
      <p className="text-base text-gray-500 max-w-sm leading-relaxed">
        No cars match your selected dates and location. Try adjusting your
        filters or search for different dates.
      </p>
    </div>
  );
}

export default NoCar
