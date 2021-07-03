import * as fs from 'fs'
import * as path from 'path'
import * as fg from 'fast-glob'
import { createRoutes } from './template/routes'
import { resolveRoutePaths } from './resolve'

export interface GenerateConfig {
  pages: string
  importPrefix?: string
  dynamicImport?: boolean
  chunkNamePrefix?: string
  nested?: boolean
}

export function generateRoutes({
  pages,
  importPrefix = '/src/pages/',
  dynamicImport = true,
  chunkNamePrefix = '',
  nested = false,
}: GenerateConfig): string {
  const patterns = ['**/*.vue', '!**/__*__.vue', '**/*.jsx', '!**/__*__.jsx', '!**/__*__/**']

  const pagePaths = fg.sync(patterns, {
    cwd: pages,
    onlyFiles: true,
  })

  const metaList = resolveRoutePaths(
    pagePaths,
    importPrefix,
    nested,
    (file) => {
      return fs.readFileSync(path.join(pages, file), 'utf8')
    }
  )

  return createRoutes(metaList, dynamicImport, chunkNamePrefix)
}
