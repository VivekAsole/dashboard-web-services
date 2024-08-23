import React, { useEffect, useState, useRef } from 'react';
import fetchAPI from '../services/fetchAPI';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

function CLVbyCohorts() {
  const chartRef = useRef(null)
  const [api_data, setApiData] = useState([{ cohort: '', total_clv: '', total_customert: '' }])

  useEffect(() => {
    const fetchData = async () => {
      const url = `${import.meta.env.VITE_URL}/api/v1/users/clvCohorts`
      const response = await fetchAPI(url)
      if (response.data) setApiData(response.data)
    }

    fetchData()
  }, [])

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d')

    const data = {
      labels: api_data.map(item => item.cohort),
      datasets: [
        {
          type: 'bar',
          label: 'Total CLV',
          data: api_data.map(item => item.total_CLV),
          backgroundColor: 'rgba(75, 192, 192, 1)',
          yAxisID: 'y',
          order: 2,
        },
        {
          type: 'line',
          label: 'Total Customers',
          data: api_data.map(item => item.total_customer),
          borderColor: 'rgba(255, 99, 132, 1)',
          yAxisID: 'y1',
          borderWidth: 3, // Make the line thicker
          tension: 0.4,
          order: 1,
        },
      ],
    }

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        y: {
          type: 'linear',
          position: 'left',
          beginAtZero: true,
          title: {
            display: true,
            text: 'Total CLV in Rs.',
          },
        },
        y1: {
          type: 'linear',
          position: 'right',
          beginAtZero: true,
          title: {
            display: true,
            text: 'Total Customers',
          },
          grid: {
            drawOnChartArea: false,
          },
        },
      },
    }

    const myChart = new Chart(ctx, {
      data,
      options,
    })

    return () => {
      myChart.destroy()
    }
  }, [api_data])

  return (
    <div className='mx-4 h-full flex flex-col justify-around'>
      <p className='text-center text-xl text-slate-600 font-bold'>Customer Lifetime Value by Cohorts</p>
      <p className='text-center text-slate-600'>Customers grouped based on the month of their first purchase</p>
      <div className='p-4 h-4/5 border-2 rounded-xl'>
        <canvas ref={chartRef} />
      </div>
    </div>
  )
}

export default CLVbyCohorts;