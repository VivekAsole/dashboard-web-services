import React, { useState } from 'react';
import TotalSales from './components/TotalSales';
import GrowthRate from './components/GrowthRate';
import NewCustomers from './components/NewCustomers';
import RepeatCustomers from './components/RepeatCustomers';
import GeographicalDistribution from './components/GeographicalDistribution';
import CLVbyCohorts from './components/CLVbyCohorts';

function App() {
  const [selectedChart, setSelectedChart] = useState('Growth Rate')

  // Function to render the selected chart component
    const renderChart = () => {
      switch (selectedChart) {
      case 'Total Sales':
        return <TotalSales />
      case 'Growth Rate':
        return <GrowthRate />
      case 'New Customers':
        return <NewCustomers />
      case 'Repeat Customers':
        return <RepeatCustomers />
      case 'Geographical Distribution':
        return <GeographicalDistribution />
        case 'Customer Lifetime Value':
        return <CLVbyCohorts />
      default:
        return <CLVbyCohorts />
    }
  }
  
  return (
    <div className='h-screen flex flex-col'>
      <header className='h-20 bg-black text-center text-2xl font-bold tracking-wider text-slate-200 flex items-center justify-center'>Dashboard</header>
      <div className='flex flex-1'>
        <div className='w-1/5 h-full bg-slate-200'>
        <p className='m-4 text-center text-2xl font-bold tracking-wider'>Charts</p>
        <ul>
            {['Total Sales', 'Growth Rate', 'New Customers', 'Repeat Customers', 'Geographical Distribution', 'Customer Lifetime Value'].map((chart) => (
              <li
                key={chart}
                className={`my-4 p-4 text-xl font-bold hover:bg-red-400 hover:cursor-pointer ${
                  selectedChart === chart ? 'bg-red-500 text-white' : 'text-slate-600'
                }`}
                onClick={() => setSelectedChart(chart)}
              >
                {chart}
              </li>
            ))}
          </ul>
        </div>
        <div className='h-full w-full'>
          {renderChart()}
        </div>
      </div>
    </div>
  )
}

export default App;