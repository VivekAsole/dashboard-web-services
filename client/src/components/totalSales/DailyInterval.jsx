import React, { useEffect, useState, useRef } from 'react';
import fetchAPI from '../../services/fetchAPI';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

function DailyInterval() {
    const chartRef = useRef(null)
    const [api_data, setApiData] = useState([{ date: '', amount: '' }])

    useEffect(() => {
        const fetchData = async () => {
            const url = `${import.meta.env.VITE_URL}/api/v1/users/data/daily`
            const response = await fetchAPI(url)
            if (response.data) setApiData(response.data)
        }

        fetchData()
    }, [])

    useEffect(() => {
        if (chartRef.current && api_data.length > 0) {
            const ctx = chartRef.current.getContext("2d")

            const chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: api_data.map((item) => item.date),
                    datasets: [
                        {
                            data: api_data.map((item) => item.amount),
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
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
        <div className='w-full h-56'>
            <canvas ref={chartRef}></canvas>
        </div>
    )
}

export default DailyInterval;