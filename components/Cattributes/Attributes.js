import React, { useState } from 'react'

export const Attributes = (props) => {
    const data = props.data;
    const [eyeShape, setEyeShape] = useState("Basic")
    const [decoration, setDecoration] = useState("Basic")
    const [animationName, setAnimationName] = useState("Basic")

    //8 eye types
    function eyeVariation(num) {
        switch (num) {
            case 1:
                setEyeShape('Basic')
                break
            case 2:
                setEyeShape('Chill')
                break
            case 3:
                setEyeShape('Cute')
                break
            case 4:
                setEyeShape('Watching')
                break
            case 5:
                setEyeShape('Night eyes')
                break
            case 6:
                setEyeShape('Wonder down')
                break
            case 7:
                setEyeShape('Wonder up')
                break
            case 8:
                setEyeShape('Circle')
                break
        }
    }


    //8 decorations types
    function decorationVariation(num) {
        switch (num) {
            case 1:
                setDecoration('Basic')
                break
            case 2:
                setDecoration('Inverted')
                break
            case 3:
                setDecoration('Twisted')
                break
            case 4:
                setDecoration('Uniform')
                break
            case 5:
                setDecoration('Uniform twist')
                break
            case 6:
                setDecoration('Tribal')
                break
            case 7:
                setDecoration('Propeller')
                break
            case 8:
                setDecoration('Single')
                break
        }
    }

    //6 Animations 
    function animationVariation(num) {
        switch (num) {
            case 1:
                setAnimationName('Head')
                break
            case 2:
                setAnimationName('Tail')
                break
            case 3:
                setAnimationName('Ears')
                break
            case 4:
                setAnimationName('Left Ear')
                break
            case 5:
                setAnimationName('Right Ear')
                break
            case 6:
                setAnimationName('Attentive')
                break
        }
    }
    return (
        <div id="cattributes">
            <div className="form-group">
                <div className='flex flex-row'>
                    <label htmlFor="minmax-range" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Eyes shape</label>
                    <div className='ml-7 h-5 bg-slate-500 rounded-md'>
                        <p className='px-1 text-center text-white font-bold font-mono text-sm'>{eyeShape}</p>
                    </div>
                </div>
                <input id="minmax-range" type="range" min="1" max="8" value={data.eyeShape} onChange={(event) => {
                    props.updateField("eyeShape", parseInt(event.target.value))
                    eyeVariation(parseInt(event.target.value))
                }} className="w-full border border-black h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
            </div>

            <div className="form-group">
                <div className='flex flex-row'>
                    <label htmlFor="minmax-range" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Decoration pattern</label>
                    <div className='ml-7 h-5 bg-slate-500 rounded-md'>
                        <p className='px-1 text-center text-white font-bold font-mono text-sm'>{decoration}</p>
                    </div>
                </div>
                <input id="minmax-range" type="range" min="1" max="8" value={data.decorationPattern} onChange={(event) => {
                    props.updateField("decorationPattern", parseInt(event.target.value))
                    decorationVariation(parseInt(event.target.value))
                    }} className="w-full border border-black h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
            </div>
            <p className='font-serif text-xl font-bold'>Decoration color pattern</p>
            <div className='flex flex-row'>
                <div className="mr-3 form-group basis-1/2">
                    <div className='flex flex-row'>
                        <label htmlFor="minmax-range" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Middle color</label>
                        <div className='ml-7 h-5 bg-slate-500 rounded-md'>
                            <p className='px-1 text-center text-white font-bold font-mono text-sm'>Code: {data.middleColor}</p>
                        </div>
                    </div>
                    <input id="minmax-range" type="range" min="0" max="98" value={data.middleColor} onChange={(event) => props.updateField("middleColor", parseInt(event.target.value))} className="w-full border border-black h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                </div>

                <div className="ml-3 form-group basis-1/2">
                    <div className='flex flex-row'>
                        <label htmlFor="minmax-range" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sides color</label>
                        <div className='ml-7 h-5 bg-slate-500 rounded-md'>
                            <p className='px-1 text-center text-white font-bold font-mono text-sm'>Code: {data.sidesColor}</p>
                        </div>
                    </div>
                    <input id="minmax-range" type="range" min="0" max="98" value={data.sidesColor} onChange={(event) => props.updateField("sidesColor", parseInt(event.target.value))} className="w-full border border-black h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                </div>
            </div>
            
            <div className="form-group">
                <div className='flex flex-row'>
                    <label htmlFor="minmax-range" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Animation</label>
                    <div className='ml-7 h-5 bg-slate-500 rounded-md'>
                        <p className='px-1 text-center text-white font-bold font-mono text-sm'>{animationName}</p>
                    </div>
                </div>
                <input id="minmax-range" type="range" min="1" max="6" value={data.animation} onChange={(event) => {
                    props.updateField("animation", parseInt(event.target.value))
                    animationVariation(parseInt(event.target.value))
                }} className="w-full border border-black h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
            </div>
        </div>
    )
}
