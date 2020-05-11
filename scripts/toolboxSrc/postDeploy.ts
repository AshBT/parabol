import fs from 'fs'
import path from 'path'
import getRethink from '../../packages/server/database/rethinkDriver'
import getProjectRoot from '../webpack/utils/getProjectRoot'

const PROJECT_ROOT = getProjectRoot()

const flushSocketConnections = async () => {
  const r = await getRethink()
  return r
    .table('User')
    .update({
      connectedSockets: []
    })
    .run()
}

const storePersistedQueries = async () => {
  const queryMap = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, 'queryMap.json')).toString())
  const hashes = Object.keys(queryMap)
  const records = hashes.map((hash) => ({
    id: hash,
    query: queryMap[hash]
  }))

  const r = await getRethink()
  const res = await r
    .table('QueryMap')
    .insert(records, {conflict: 'replace'})
    .run()
  console.log(`Added ${res.inserted} records to the queryMap`)
}

const postDeploy = async () => {
  try {
    const r = await getRethink()
    await flushSocketConnections()
    await storePersistedQueries()
    await r.getPoolMaster().drain()
  } catch (e) {
    console.log('Post deploy error', e)
  }

  process.exit()
}

postDeploy()
