import React, { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js';
import fetchAPI from '../services/fetchAPI';

function NewCustomers() {
  const chartRef = useRef(null)
  const [api_data, setApiData] = useState([{ date: '', Customer_Count: '' }])

  useEffect(() => {
    const fetchData = async () => {
      const url = `${import.meta.env.VITE_URL}/api/v1/users/newCustomers`
      const response = await fetchAPI(url)
      if(response.data) setApiData(response.data)
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (chartRef.current && api_data.length > 0) {
      const ctx = chartRef.current.getContext("2d")

      const chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: api_data.map((item) => item.date),
          datasets: [
            {
              data: api_data.map((item) => item.Customer_Count),
              borderColor: "rgba(75,192,192,1)",
              backgroundColor: "rgba(75,192,192,0.2)",
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: false
            },
          }
        },
      })

      // Cleanup function to destroy the chart when the component unmounts
      return () => {
        chart.destroy()
      }
    }
  }, [api_data])

  return (
    <div className='p-4 h-full'>
      <p className='mb-4 text-center text-xl text-slate-600 font-bold'>New Customers Added Over Time (Monthly)</p>
      <div className='p-4 h-4/5 border-2 rounded-xl'>      
      <p className='text-center text-slate-500 font-bold'>No. of Customers vs Month</p>
      <canvas className='p-4' ref={chartRef}></canvas>
      </div>
    </div>
  ) 
}

export default NewCustomers;
