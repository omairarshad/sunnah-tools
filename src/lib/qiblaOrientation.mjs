/* A phone sensor may return a heading relative to magnetic, not true, north. */
export function headingOffset(qiblaTrue,headingMagnetic,declinationEast){
 if(![qiblaTrue,headingMagnetic,declinationEast].every(Number.isFinite))return null;
 if(qiblaTrue<0||qiblaTrue>360||headingMagnetic<0||headingMagnetic>360||Math.abs(declinationEast)>30)return null;
 const trueHeading=(headingMagnetic+declinationEast+360)%360;
 const signed=((qiblaTrue-trueHeading+540)%360)-180;
 return Math.abs(signed)<0.05?0:Math.round(signed*10)/10;
}
