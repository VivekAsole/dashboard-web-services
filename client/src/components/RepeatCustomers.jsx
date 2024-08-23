import React, { useEffect, useState, useRef } from 'react';
import fetchAPI from '../services/fetchAPI';
import { Chart, registerables } from 'chart.js';
import YearlyChart from './repeatCustomer/YearlyChart';

Chart.register(...registerables);

function RepeatCustomers() {
  const chartRef = useRef(null)
  const [interval, setInterval] = useState('monthly')
  const [api_data, setApiData] = useState([{ date: '', customer_count: '' }])

  useEffect(() => {
    const fetchData = async () => {
      const url = `${import.meta.env.VITE_URL}/api/v1/users/repeatCustomers/${interval}`
      const response = await fetchAPI(url)
      if (response.data) setApiData(response.data)
    }

    fetchData()
  }, [interval])

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d')

    // Create a new bar chart
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: api_data.map(item => item.date),
        datasets: [
          {
            data: api_data.map(item => item.customer_count),
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: false,
          },
        },

      },
    })

    // Cleanup function to destroy the chart when the component unmounts
    return () => {
      chart.destroy()
    }
  }, [api_data])

  return (
    <div className='flex flex-col justify-around h-full'>
      <p className='m-2 text-xl font-bold text-slate-600 text-center '>Number of Repeat Customers</p>
      <div className='border-2 rounded-xl my-2 mx-4 p-4 h-1/2'>
        <div className='font-bold'>
          <button
            className={`mx-4 px-2 text-sm rounded-full border border-black ${interval === 'monthly' ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
            onClick={() => setInterval('monthly')}
          >
            Monthly
          </button>
          <button
            className={`px-2 text-sm rounded-full border border-black ${interval === 'quarterly' ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
            onClick={() => setInterval('quarterly')}
          >
            Quarterly
          </button>
        </div>
        <div className='h-full p-4'>
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
      <div className='border-2 rounded-xl mx-4 h-full'>
        <p className='text-center text-slate-600 font-bold'>Based on Year</p>
        <YearlyChart />
      </div>
    </div>
  )
}

export default RepeatCustomers;