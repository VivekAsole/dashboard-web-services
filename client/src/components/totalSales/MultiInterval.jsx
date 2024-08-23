import React, { useEffect, useState, useRef } from 'react';
import fetchAPI from '../../services/fetchAPI';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

function MultiInterval() {

    const chartRef = useRef(null)
    const [interval, setInterval] = useState('monthly')
    const [api_data, setApiData] = useState([{ date: '', amount: '' }])

    useEffect(() => {
        const fetchData = async () => {
            const url = `${import.meta.env.VITE_URL}/api/v1/users/data/${interval}`
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
                        data: api_data.map(item => item.amount),
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
        <div>
            <div>
                <button
                    className={`m-2 px-2 text-sm rounded-full border border-black ${interval === 'monthly' ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
                    onClick={() => setInterval('monthly')}
                >
                    Monthly
                </button>
                <button
                    className={`m-2 px-2 text-sm rounded-full border border-black ${interval === 'quarterly' ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
                    onClick={() => setInterval('quarterly')}
                >
                    Quarterly
                </button>
            </div>
            <div>
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    )
}

export default MultiInterval;