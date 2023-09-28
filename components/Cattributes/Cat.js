import React from 'react'
import { colors } from '../utils/colors.js';

export const Cat = (props) => {
    const data = props.dna ? catProp(props.dna) : props.data;
    function catProp(dna) {
        const DNA = dna.length == 14 ? "0" + dna : dna
        const cat = {};
        cat.headBodyColor = parseInt(DNA.slice(0, 2))
        cat.bodyColor = parseInt(DNA.slice(2, 4))
        cat.eyesColor = parseInt(DNA.slice(4, 6))
        cat.earsPawColor = parseInt(DNA.slice(6, 8))
        cat.eyeShape = parseInt(DNA.slice(8, 9))
        cat.decorationPattern = parseInt(DNA.slice(9, 10))
        cat.middleColor = parseInt(DNA.slice(10, 12))
        cat.sidesColor = parseInt(DNA.slice(12, 14))
        cat.animation = parseInt(DNA.slice(14, 15))
        return cat
    }
    const animation = parseInt(data.animation != undefined ? data.animation : 0)
    function eyeVariation(num) {
        let eye = {};
        switch (num) {
            case 1:
                eye = { 'border': 'none', 'backgroundColor': `#${colors[data.eyesColor]}` }
                break
            case 2:
                eye = { 'borderTop': '15px solid', 'backgroundColor': `#${colors[data.eyesColor]}` }
                break
            case 3:
                eye = { 'borderBottom': '15px solid', 'backgroundColor': `#${colors[data.eyesColor]}` }
                break
            case 4:
                eye = { 'borderTop': '15px solid', 'borderBottom': '15px solid', 'backgroundColor': `#${colors[data.eyesColor]}` }
                break
            case 5:
                eye = { 'borderRight': '15px solid', 'borderLeft': '15px solid', 'backgroundColor': `#${colors[data.eyesColor]}` }
                break
            case 6:
                eye = { 'borderRight': '15px solid', 'borderLeft': '15px solid', 'borderTop': '15px solid', 'backgroundColor': `#${colors[data.eyesColor]}` }
                break
            case 7:
                eye = { 'borderRight': '15px solid', 'borderLeft': '15px solid', 'borderBottom': '15px solid', 'backgroundColor': `#${colors[data.eyesColor]}` }
                break
            case 8:
                eye = { 'border': '15px solid', 'backgroundColor': `#${colors[data.eyesColor]}` }
                break
        }
        return eye;
    }
    function decorationVariation(num) {
        const decoration = []
        switch (num) {
            case 1:
                decoration[0] = { "transform": "rotate(0deg)", "height": "48px", "width": "14px", "top": "1px", "borderRadius": "0 0 50% 50%", 'backgroundColor': `#${colors[data.middleColor]}` }
                decoration[1] = { "transform": "rotate(0deg)", "height": "35px", "width": "14px", "top": "1px", "borderRadius": "50% 0 50% 50%", 'backgroundColor': `#${colors[data.sidesColor]}` }
                decoration[2] = { "transform": "rotate(0deg)", "height": "35px", "width": "14px", "top": "1px", "borderRadius": "0 50% 50% 50%", 'backgroundColor': `#${colors[data.sidesColor]}` }
                break
            case 2:
                decoration[0] = { "transform": "rotate(180deg)", 'backgroundColor': `#${colors[data.middleColor]}` }
                decoration[1] = { "transform": "rotate(0deg)", 'backgroundColor': `#${colors[data.sidesColor]}` }
                decoration[2] = { "transform": "rotate(0deg)", 'backgroundColor': `#${colors[data.sidesColor]}` }
                break
            case 3:
                decoration[0] = { "transform": "rotate(180deg)", 'backgroundColor': `#${colors[data.middleColor]}` }
                decoration[1] = { "transform": "rotate(180deg)", 'backgroundColor': `#${colors[data.sidesColor]}` }
                decoration[2] = { "transform": "rotate(180deg)", 'backgroundColor': `#${colors[data.sidesColor]}` }
                break
            case 4:
                decoration[0] = { "height": "40px", "width": "20px", 'backgroundColor': `#${colors[data.middleColor]}` }
                decoration[1] = { "height": "40px", "width": "20px", 'backgroundColor': `#${colors[data.sidesColor]}` }
                decoration[2] = { "height": "40px", "width": "20px", 'backgroundColor': `#${colors[data.sidesColor]}` }
                break
            case 5:
                decoration[0] = { "height": "40px", "width": "20px", "transform": "rotate(180deg)", 'backgroundColor': `#${colors[data.middleColor]}` }
                decoration[1] = { "height": "40px", "width": "20px", "transform": "rotate(180deg)", 'backgroundColor': `#${colors[data.sidesColor]}` }
                decoration[2] = { "height": "40px", "width": "20px", "transform": "rotate(180deg)", 'backgroundColor': `#${colors[data.sidesColor]}` }
                break
            case 6:
                decoration[0] = { "transform": "rotate(180deg)", "height": "50px", "borderRadius": "50% 50% 50% 50%", 'backgroundColor': `#${colors[data.middleColor]}` }
                decoration[1] = { "transform": "rotate(35deg)", "height": "40px", 'backgroundColor': `#${colors[data.sidesColor]}` }
                decoration[2] = { "transform": "rotate(-35deg)", "height": "40px", 'backgroundColor': `#${colors[data.sidesColor]}` }
                break
            case 7:
                decoration[0] = { "transform": "rotate(180deg)", "height": "50px", "borderRadius": "50% 50% 50% 50%", 'backgroundColor': `#${colors[data.middleColor]}` }
                decoration[1] = { "transform": "rotate(135deg)", "height": "45px", "top": "-25px", 'backgroundColor': `#${colors[data.sidesColor]}` }
                decoration[2] = { "transform": "rotate(-135deg)", "height": "45px", "top": "-25px", 'backgroundColor': `#${colors[data.sidesColor]}` }
                break
            case 8:
                decoration[0] = { 'backgroundColor': `#${colors[data.middleColor]}` }
                decoration[1] = { 'height': '0px', 'backgroundColor': `#${colors[data.sidesColor]}` }
                decoration[2] = { 'height': '0px', 'backgroundColor': `#${colors[data.sidesColor]}` }
                break
        }
        return decoration
    }
    return (
        <div className="pb-20">
            <div className="cat__ear">
                <div id="leftEar" className="cat__ear--left" style={{ backgroundColor: `#${colors[data.earsPawColor]}`, animation: (animation == 1 || animation == 3 || animation == 4 || animation == 6) ? (animation == 1 || animation == 3) ? "moveEarsLeft 6s infinite" : (animation == 4) ? "earLeft 3s infinite" : "earUpLeft 6s infinite" : null }}>
                    <div className="cat__ear--left-inside"></div>
                </div>
                <div id="rightEar" className="cat__ear--right" style={{ backgroundColor: `#${colors[data.earsPawColor]}`, animation: (animation == 1 || animation == 3 || animation == 5 || animation == 6) ? (animation == 1 || animation == 3) ? "moveEarsRight 6s infinite" : (animation == 5) ? "earRight 3s infinite" : "earUpRight 6s infinite" : null }}>
                    <div className="cat__ear--right-inside"></div>
                </div>
            </div>

            <div id="head" className="cat__head" style={{ "backgroundColor": `#${colors[data.headBodyColor]}`, animation: animation == 1 ? "moveHead 6s infinite" : null }}>
                <div id="midDot" className="cat__head-dots" style={data.decorationPattern ? decorationVariation(parseInt(data.decorationPattern))[0] : { 'backgroundColor': `#${colors[data.middleColor]}` }}>
                    <div id="leftDot" className="cat__head-dots_first" style={data.decorationPattern ? decorationVariation(parseInt(data.decorationPattern))[1] : { 'backgroundColor': `#${colors[data.sidesColor]}` }}></div>
                    <div id="rightDot" className="cat__head-dots_second" style={data.decorationPattern ? decorationVariation(parseInt(data.decorationPattern))[2] : { 'backgroundColor': `#${colors[data.sidesColor]}` }}></div>
                </div>
                <div className="cat__eye">
                    <div className="cat__eye--left">
                        <span className="pupil-left" style={data.eyeShape ? eyeVariation(parseInt(data.eyeShape)) : { 'backgroundColor': `#${colors[data.eyesColor]}` }}></span>
                    </div>
                    <div className="cat__eye--right">
                        <span className="pupil-right" style={data.eyeShape ? eyeVariation(parseInt(data.eyeShape)) : { 'backgroundColor': `#${colors[data.eyesColor]}` }}></span>
                    </div>
                </div>
                <div className="cat__nose"></div>

                <div className="cat__mouth-contour" style={{ backgroundColor: `#${colors[data.bodyColor]}` }}></div>
                <div className="cat__mouth-left"></div>
                <div className="cat__mouth-right"></div>

                <div className="cat__whiskers-left"></div>
                <div className="cat__whiskers-right"></div>
            </div>

            <div className="cat__body">

                <div className="cat__chest" style={{ backgroundColor: `#${colors[data.headBodyColor]}` }}></div>

                <div className="cat__chest_inner" style={{ backgroundColor: `#${colors[data.bodyColor]}` }}></div>


                <div className="cat__paw-left" style={{ backgroundColor: `#${colors[data.earsPawColor]}` }}></div>
                <div className="cat__paw-left_inner" style={{ backgroundColor: `#${colors[data.earsPawColor]}` }}></div>


                <div className="cat__paw-right" style={{ backgroundColor: `#${colors[data.earsPawColor]}` }}></div>
                <div className="cat__paw-right_inner" style={{ backgroundColor: `#${colors[data.earsPawColor]}` }}></div>


                <div id="tail" className="cat__tail" style={{ backgroundColor: `#${colors[data.bodyColor]}`, animation: animation == 2 ? "moveTail 2.5s infinite" : null }}></div>
            </div>
        </div>
    )
}
