import * as rawInput from '../../src/inputs/raw'
import { pageLimit } from '../../src/inputs/parsed'

describe('pageLimit', () => {
  it('should return 1 when pageLimitInput returns an invalid value', () => {
    jest.spyOn(rawInput, 'pageLimitInput').mockReturnValue('')

    expect(pageLimit()).toBe(1)
  })

  it('should return the parsed page limit', () => {
    jest.spyOn(rawInput, 'pageLimitInput').mockReturnValue('15')

    expect(pageLimit()).toBe(15)
  })

  it('should return 1 when pageLimitInput throws an error', () => {
    jest.spyOn(rawInput, 'pageLimitInput').mockReturnValue('a wtway yaweyh')

    expect(pageLimit()).toBe(1)
  })

  it('should return a large limit when the parsed page limit is less than 1', () => {
    jest.spyOn(rawInput, 'pageLimitInput').mockReturnValue('0')

    expect(pageLimit()).toBe(100000)
  })
})
