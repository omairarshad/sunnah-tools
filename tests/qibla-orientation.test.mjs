import {test} from 'node:test';
import assert from 'node:assert/strict';
import {headingOffset} from '../src/lib/qiblaOrientation.mjs';
test('magnetic heading corrected by verified east-positive declination',()=>{
 assert.equal(headingOffset(90,90,0),0);
 assert.equal(headingOffset(100,80,10),10);
 assert.equal(headingOffset(100,120,-10),-10);
 assert.equal(headingOffset(355,10,0),-15);
 assert.equal(headingOffset(10,350,0),20);
});
test('unverified and invalid sensor data never produce a direction',()=>{
 assert.equal(headingOffset(80,NaN,0),null);
 assert.equal(headingOffset(80,40,NaN),null);
 assert.equal(headingOffset(80,40,180),null);
 assert.equal(headingOffset(-15,40,0),null);
});
