import { cacheCreator } from './factories/createCache'

const cacheCtr = cacheCreator()

export const initCacheClient = cacheCtr.initialize
export const getCache = cacheCtr.getClient
