import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer Comment Use Case', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository,
    )
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    const student = makeStudent({ name: 'John Doe' })

    inMemoryStudentsRepository.items.push(student)

    const comment1 = makeAnswerComment({
      authorId: student.id,
      answerId: new UniqueEntityId('answer-01'),
    })

    const comment2 = makeAnswerComment({
      authorId: student.id,
      answerId: new UniqueEntityId('answer-01'),
    })

    const comment3 = makeAnswerComment({
      authorId: student.id,
      answerId: new UniqueEntityId('answer-01'),
    })

    await inMemoryAnswerCommentsRepository.create(comment1)
    await inMemoryAnswerCommentsRepository.create(comment2)
    await inMemoryAnswerCommentsRepository.create(comment3)

    const result = await sut.execute({
      answerId: 'answer-01',
      page: 1,
      pageSize: 20,
    })

    expect(result.value?.comments).toHaveLength(3)
  })

  it('should be able to fetch paginated answer comments', async () => {
    const student = makeStudent({ name: 'John Doe' })

    inMemoryStudentsRepository.items.push(student)

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          authorId: student.id,
          answerId: new UniqueEntityId('answer-01'),
        }),
      )
    }

    const result = await sut.execute({
      answerId: 'answer-01',
      page: 2,
      pageSize: 20,
    })

    expect(result.value?.comments).toHaveLength(2)
  })
})
