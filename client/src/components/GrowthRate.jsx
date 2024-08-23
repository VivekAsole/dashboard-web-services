import React, { useEffect, useState, useRef } from 'react';
import fetchAPI from '../services/fetchAPI';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

function GrowthRate() {

  const chartRef = useRef(null)
  const [interval, setInterval] = useState('monthly')
  const [api_data, setApiData] = useState([{ date: '', growth: '' }])

  // Function to calculate growth rate
  function calculateGrowthRate(current, previous) {
    return ((current - previous) / previous) * 100
  }

  useEffect(() => {
    const growthRates = []
    const fetchData = async () => {
      const url = `${import.meta.env.VITE_URL}/api/v1/users/data/${interval}`
      const response = await fetchAPI(url)
      if (response.data) {
        // Calculate growth rates and store them
        for (let i = 1; i < response.data.length; i++) {
          const current = response.data[i].amount
          const previous = response.data[i - 1].amount
          const growthRate = calculateGrowthRate(current, previous).toFixed(2)
          growthRates.push({
            date: response.data[i].date,
            growth: growthRate
          })
        }
        setApiData(growthRates)
      }
    }

    fetchData()
  }, [interval])

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    // Create a new bar chart
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: api_data.map(item => item.date),
        datasets: [
          {
            data: api_data.map(item => item.growth),
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
    <div className='flex flex-col h-full p-4'>
      <p className='mb-4 text-center text-xl text-slate-600 font-bold'>Growth Rate based on Months and Quarters</p>
      <div className='flex flex-col justify-between p-4 h-full border-2 rounded-xl'>
        <div className='font-bold'>
          <button
            className={`m-2 px-4 py-1 rounded-full border-2 border-black ${interval === 'monthly' ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
            onClick={() => setInterval('monthly')}
          >
            Monthly
          </button>
          <button
            className={`m-2 px-4 py-1 rounded-full border-2 border-black ${interval === 'quarterly' ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
            onClick={() => setInterval('quarterly')}
          >
            Quarterly
          </button>
        </div>
        <div className='h-4/5'>
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </div>
  )
}

export default GrowthRate;