import React from 'react';
import DailyInterval from './totalSales/dailyInterval';
import MultiInterval from './totalSales/MultiInterval';
import YearlyInterval from './totalSales/YearlyInterval';

function TotalSales() {
    return (
        <div className='p-4 h-full'>
            <p className='text-center font-bold text-xl text-slate-600'>Total Sales Analysis</p>
            <div className='flex justify-between'>
                <div className='my-2 mr-2 w-2/3 border-2 border-slate-400 rounded-xl'>
                    <MultiInterval />
                </div>
                <div className='my-2 w-1/3 border-2 border-slate-400 rounded-xl'>
                    <p className='m-2 font-bold text-center text-slate-600'>Based on Year</p>
                    <YearlyInterval />
                </div>
            </div>
            <div className='my-4 border-2 border-slate-400 rounded-xl'>
                <p className='mx-4 font-bold text-center text-slate-600'>Daily Basis</p>
                <DailyInterval />
            </div>
        </div>
    );
};

export default TotalSales;