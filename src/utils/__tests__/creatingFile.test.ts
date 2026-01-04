import fs from 'fs'
import path from 'path'
import { writeTemplateFile, updateTemplateFile } from '../creatingFile'

describe('creatingFile', () => {
  it('writes and updates a file', () => {
    const slug = 'test-template'
    const content = "<h1>Test</h1>"
    const filePath = writeTemplateFile(slug, content)
    expect(fs.existsSync(filePath)).toBe(true)
    const updatedContent = "<h2>Updated</h2>"
    updateTemplateFile(slug, updatedContent)
    expect(fs.readFileSync(filePath, 'utf8')).toBe(updatedContent)
    // Clean up: fs.unlinkSync(filePath)
  })

  it('throws when updating missing file', () => {
    expect(() => updateTemplateFile('no-file', '<h1>Missing</h1>')).toThrow('Template file not found for update.')
  })
})
