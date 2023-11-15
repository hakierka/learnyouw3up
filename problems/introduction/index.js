import fs from 'node:fs'
import path from 'node:path'
import { execaNode } from 'execa'
import msee from 'msee'
import { Schema } from '@ucanto/validator'

export const problem = msee.parse(fs.readFileSync(new URL('./problem.md', import.meta.url), 'utf8'))

export const solution = msee.parse(fs.readFileSync(new URL('./solution.md', import.meta.url), 'utf8'))

/**
 * @param {string[]} args
 * @param {(success: boolean) => void} cb
 */
export const verify = (args, cb) => {
  (async () => {
    const filepath = path.resolve(args[0])
    console.log(`Verifying ${filepath}...\n`)
    const { stdout, all } = await execaNode(filepath, [], { all: true })
    console.log(all ?? '')

    const spaceDID = String(stdout.split(`\n`).at(-1)).trim()
    if (!Schema.did({ method: 'key' }).is(stdout.trim())) {
      cb(false)
      return console.log(`"${spaceDID}" is not a DID`)
    }

    cb(true)
  })()
}
