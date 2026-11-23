import type { Scenario } from '../domain/types';
import { isScenario } from '../domain/validation';
export type SavedScenario={id:string;name:string;createdAt:string;scenario:Scenario};
const KEY='optionpilot.saved.v1';
export function readSaved(storage:Storage=localStorage):SavedScenario[]{
  try { const raw=storage.getItem(KEY); if(!raw)return[]; const value:unknown=JSON.parse(raw); if(!Array.isArray(value))return[]; return value.filter((x):x is SavedScenario=>!!x&&typeof x==='object'&&typeof x.id==='string'&&typeof x.name==='string'&&typeof x.createdAt==='string'&&isScenario(x.scenario)); } catch { return[]; }
}
export function writeSaved(items:SavedScenario[],storage:Storage=localStorage):void { storage.setItem(KEY,JSON.stringify(items)); }
export function exportScenario(scenario:Scenario,name='OptionPilot scenario'):string { return JSON.stringify({schemaVersion:1,name,exportedAt:new Date().toISOString(),scenario},null,2); }
export function parseScenarioImport(text:string):{name:string;scenario:Scenario} {
  const parsed:unknown=JSON.parse(text); if(!parsed||typeof parsed!=='object')throw new Error('Import must be a JSON object.');
  const v=parsed as Record<string,unknown>; if(v.schemaVersion!==1||typeof v.name!=='string'||!isScenario(v.scenario))throw new Error('Unsupported or invalid OptionPilot scenario file.');
  return {name:v.name,scenario:v.scenario};
}
