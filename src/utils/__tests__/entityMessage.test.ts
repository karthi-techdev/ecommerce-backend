import { SuccessMessage } from '../entityMessage'

describe('SuccessMessage', () => {
  it('gives correct messages for types', () => {
    expect(SuccessMessage('FAQ', { type: 'created' })).toBe('FAQ has been created successfully')
    expect(SuccessMessage('FAQ', { type: 'updated' })).toBe('FAQ has been updated successfully')
    expect(SuccessMessage('FAQ', { type: 'deleted' })).toBe('FAQ has been deleted successfully')
    expect(SuccessMessage('FAQ', { type: 'invalid' } as any)).toBe('')
  })
})
