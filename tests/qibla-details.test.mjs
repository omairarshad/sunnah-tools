import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Qibla,Coordinates} from 'adhan';
import {KAABA,normalizeBearing,cardinalDirection,qiblaContext,magneticBearing} from '../src/lib/qiblaDetails.mjs';
test('cardinal directions include wraparound',()=>{
 assert.equal(cardinalDirection(0).abbreviation,'N');
 assert.equal(cardinalDirection(90).abbreviation,'E');
 assert.equal(cardinalDirection(119).abbreviation,'ESE');
 assert.equal(cardinalDirection(225).abbreviation,'SW');
 assert.equal(cardinalDirection(359.99).abbreviation,'N');
 assert.equal(normalizeBearing(-1),359);
 assert.equal(cardinalDirection(Infinity),null);
});
test('coordinates and great-circle distances are validated',()=>{
 const bearing=Qibla(new Coordinates(51.5072,-.1276));
 const london=qiblaContext(51.5072,-.1276,bearing);
 assert.equal(london.status,'ok');
 assert.ok(bearing>110&&bearing<130);
 assert.equal(london.cardinal.abbreviation,'ESE');
 assert.ok(london.distanceKm>4500&&london.distanceKm<5500);
 assert.equal(qiblaContext(KAABA.latitude,KAABA.longitude,0).status,'at-kaaba');
 assert.equal(qiblaContext(-KAABA.latitude,KAABA.longitude-180,0).status,'antipode');
 assert.equal(qiblaContext(NaN,0,0),null);
 assert.equal(qiblaContext(91,0,0),null);
});
test('magnetic conversion follows NOAA east-positive convention',()=>{
 assert.equal(magneticBearing(119,2),117);
 assert.equal(magneticBearing(119,-3),122);
 assert.equal(magneticBearing(1,4),357);
 assert.equal(magneticBearing(359,-4),3);
 assert.equal(magneticBearing(0,0),0);
 assert.equal(magneticBearing(119,NaN),null);
 assert.equal(magneticBearing(119,45),null);
 assert.equal(magneticBearing(-1,0),null);
});
