import { HTTP_RESPONSE, HTTP_STATUS_CODE } from '../httpResponse'

describe('HTTP_RESPONSE and HTTP_STATUS_CODE', () => {
  it('has correct status flags', () => {
    expect(HTTP_RESPONSE.SUCCESS).toBe(true)
    expect(HTTP_RESPONSE.FAIL).toBe(false)
  })

  it('contains status codes', () => {
    expect(HTTP_STATUS_CODE.OK).toBe(200)
    expect(HTTP_STATUS_CODE.BAD_REQUEST).toBe(400)
    expect(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).toBe(500)
  })
})
