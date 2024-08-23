import React, { useEffect, useState, useRef } from 'react';
import fetchAPI from '../../services/fetchAPI';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

function YearlyChart() {
    const chartRef = useRef(null);
    const [api_data, setApiData] = useState([{ date: '', customer_count: '' }]);

    useEffect(() => {
        const fetchData = async () => {
            const url = `${import.meta.env.VITE_URL}/api/v1/users/repeatCustomers/yearly`;
            const response = await fetchAPI(url);
            if (response.data) setApiData(response.data)
        }

        fetchData()
    }, [])

    useEffect(() => {
        const ctx = chartRef.current.getContext('2d')

        // Create a new horizontal bar chart
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
                indexAxis: 'y', 
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: false
                    },
                },
                scales: {
                    x: {
                        beginAtZero: true,
                    },
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        })

        // Cleanup function to destroy the chart when the component unmounts
        return () => {
            chart.destroy();
        };
    }, [api_data])

    return (
        <div className='h-4/5'>
            <canvas ref={chartRef}></canvas>
        </div>
    )
}

export default YearlyChart;
