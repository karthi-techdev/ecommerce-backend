import ValidationHelper from '../validationHelper'

describe('ValidationHelper', () => {
  it('validates required', () => {
    expect(ValidationHelper.isRequired('', 'question')).toEqual({ field: 'question', message: 'question is required' })
    expect(ValidationHelper.isRequired('test', 'question')).toBeNull()
  })

  it('validates boolean', () => {
    expect(ValidationHelper.isBoolean(true, 'isDeleted')).toBeNull()
    expect(ValidationHelper.isBoolean('no', 'isDeleted')).toEqual({ field: 'isDeleted', message: 'isDeleted must be a boolean' })
  })

  it('validates email', () => {
    expect(ValidationHelper.isValidEmail('not-an-email', 'email')).toEqual({ field: 'email', message: 'email must be a valid email address' })
    expect(ValidationHelper.isValidEmail('valid@example.com', 'email')).toBeNull()
  })

  it('validates enum', () => {
    expect(ValidationHelper.isValidEnum('wrong', 'status', ['active', 'inactive'])).toEqual({ field: 'status', message: 'status must be one of: active, inactive' })
    expect(ValidationHelper.isValidEnum('active', 'status', ['active', 'inactive'])).toBeNull()
  })
})
