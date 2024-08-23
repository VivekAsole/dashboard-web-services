import React, { useEffect, useState } from 'react';
import fetchAPI from '../services/fetchAPI';
import MapComponent from './map/MapComponent';

function GeographicalDistribution() {
  const [api_data, setApiData] = useState([{ city: '', customer_count: '' }])

  useEffect(() => {
    const fetchData = async () => {
      const url = `${import.meta.env.VITE_URL}/api/v1/users/geoDistribution`
      const response = await fetchAPI(url)
      if (response.data) setApiData(response.data)
    }

    fetchData()
  }, [])
  return (
    <div className='relative p-4 h-full'>
      <p className='mb-4 text-center text-xl text-slate-600 font-bold'>Customer distribution based on City</p>
      <div className='h-4/5'>
        <MapComponent cityData={api_data} />
      </div>
      <div class="flex gap-4 p-2">
        <strong className='text-slate-600'>Customer Count</strong>
        <div>
          <span class="bg-red-500 inline-block w-3 h-3 mr-1.5"></span>
          &gt; 12
        </div>
        <div>
          <span class="bg-orange-500 inline-block w-3 h-3 mr-1.5"></span>
          10-12
        </div>
        <div>
          <span class="bg-pink-500 inline-block w-3 h-3 mr-1.5"></span>
          7-9
        </div>
        <div>
          <span class="bg-yellow-300 inline-block w-3 h-3 mr-1.5"></span>
          4-6
        </div>
        <div>
          <span class="bg-green-500 inline-block w-3 h-3 mr-1.5"></span>
          1-3
        </div>
      </div>
    </div>
  )
}

export default GeographicalDistribution;