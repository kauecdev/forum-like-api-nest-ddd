import { Either, left, right } from './either'

function doSomething(shouldSuccess: boolean): Either<string, number> {
  if (shouldSuccess) {
    return right(10)
  }

  return left('error')
}

describe('Either', () => {
  it('should return success result', () => {
    const result = doSomething(true)

    expect(result.isLeft()).toBe(false)
    expect(result.isRight()).toBe(true)
  })

  it('should return error result', () => {
    const result = doSomething(false)

    expect(result.isLeft()).toBe(true)
    expect(result.isRight()).toBe(false)
  })
})
