import React, { useEffect, useState, useRef } from 'react';
import fetchAPI from '../../services/fetchAPI';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

function YearlyInterval() {

    const chartRef = useRef(null)
    const [api_data, setApiData] = useState([{ date: '', amount: '' }])

    useEffect(() => {
        const fetchData = async () => {
            const url = `${import.meta.env.VITE_URL}/api/v1/users/data/yearly`
            const response = await fetchAPI(url);
            if (response.data) setApiData(response.data)
        }

        fetchData()
    }, [])

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
            <canvas ref={chartRef}></canvas>
        </div>
    )
}

export default YearlyInterval;