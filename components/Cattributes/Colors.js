import React from 'react'

export const Colors = (props) => {
    const data = props.data;
    return (
        <div id="catColors">
            <div className="form-group">
                <div className='flex flex-row'>
                    <label htmlFor="minmax-range" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Head and body</label>
                    <div className='ml-7 h-5 bg-slate-500 rounded-md'>
                        <p className='px-1 text-center text-white font-bold font-mono text-sm'>Code: {data.headBodyColor}</p>
                    </div>
                </div>
                <input id="minmax-range" type="range" min="0" max="98" value={data.headBodyColor ?? 5} onChange={(event) => props.updateField("headBodyColor", parseInt(event.target.value))} className="w-full border border-black h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
            </div>

            <div className="form-group">
                <div className='flex flex-row'>
                    <label htmlFor="minmax-range" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mouth | Belly | Tail</label>
                    <div className='ml-7 h-5 bg-slate-500 rounded-md'>
                        <p className='px-1 text-center text-white font-bold font-mono text-sm'>Code: {data.bodyColor}</p>
                    </div>
                </div>
                <input id="minmax-range" type="range" min="0" max="98" value={data.bodyColor ?? 5} onChange={(event) => props.updateField("bodyColor", parseInt(event.target.value))} className="w-full border border-black h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
            </div>

            <div className="form-group">
                <div className='flex flex-row'>
                    <label htmlFor="minmax-range" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Eyes color</label>
                    <div className='ml-7 h-5 bg-slate-500 rounded-md'>
                        <p className='px-1 text-center text-white font-bold font-mono text-sm'>Code: {data.eyesColor}</p>
                    </div>
                </div>
                <input id="minmax-range" type="range" min="0" max="98" value={data.eyesColor ?? 5} onChange={(event) => props.updateField("eyesColor", parseInt(event.target.value))} className="w-full border border-black h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
            </div>

            <div className="form-group">
                <div className='flex flex-row'>
                    <label htmlFor="minmax-range" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ears | Paw</label>
                    <div className='ml-7 h-5 bg-slate-500 rounded-md'>
                        <p className='px-1 text-center text-white font-bold font-mono text-sm'>Code: {data.earsPawColor}</p>
                    </div>
                </div>
                <input id="minmax-range" type="range" min="0" max="98" value={data.earsPawColor ?? 5} onChange={(event) => props.updateField("earsPawColor", parseInt(event.target.value))} className="w-full border border-black h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
            </div>
        </div>
    );
}
