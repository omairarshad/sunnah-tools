import {test} from 'node:test';
import assert from 'node:assert/strict';
import {analyticsSettings} from '../src/lib/analyticsConfig.mjs';
test('analytics is entirely disabled until correctly configured',()=>{assert.deepEqual(analyticsSettings({}),{id:null,enabled:false,dashboardUrl:null});assert.equal(analyticsSettings({measurementId:'G-ABC1234567',enabled:'false'}).enabled,false)});
test('only correct GA4 measurement IDs enable analytics',()=>{assert.equal(analyticsSettings({measurementId:'G-ABC1234567',enabled:'true'}).enabled,true);assert.equal(analyticsSettings({measurementId:'UA-123',enabled:'true'}).enabled,false)});
test('dashboard URL only allows secure authentic Looker Studio reports',()=>{assert.equal(analyticsSettings({dashboardUrl:'javascript:alert(1)'}).dashboardUrl,null);assert.equal(analyticsSettings({dashboardUrl:'https://evil.tld/reporting/a'}).dashboardUrl,null);assert.equal(analyticsSettings({dashboardUrl:'https://lookerstudio.google.com/reporting/a123/page/p123'}).dashboardUrl,'https://lookerstudio.google.com/reporting/a123/page/p123')});
