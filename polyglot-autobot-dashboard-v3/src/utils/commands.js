// src/utils/commands.js
import { useConfig } from '../config.jsx';
import { postJSON } from './http.js';
export function usePostCommand(){
  const { cfg } = useConfig();
  const isElectron = !!(typeof process!=='undefined' && process.versions?.electron);
  const fallbackKey = isElectron ? (process.env?.COMMAND_API_KEY || '') : '';
  return (type, params={}) =>
    postJSON(cfg.apiUrl.replace(/\/$/,'')+'/commands', {type, params}, cfg.apiKey||fallbackKey);
}
