import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Question Comment Use Case', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository,
    )
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to fetch question comments', async () => {
    const student = makeStudent({ name: 'John Doe' })

    inMemoryStudentsRepository.items.push(student)

    const comment1 = makeQuestionComment({
      authorId: student.id,
      questionId: new UniqueEntityId('question-01'),
    })

    const comment2 = makeQuestionComment({
      authorId: student.id,
      questionId: new UniqueEntityId('question-01'),
    })

    const comment3 = makeQuestionComment({
      authorId: student.id,
      questionId: new UniqueEntityId('question-01'),
    })

    await inMemoryQuestionCommentsRepository.create(comment1)

    await inMemoryQuestionCommentsRepository.create(comment2)

    await inMemoryQuestionCommentsRepository.create(comment3)

    const result = await sut.execute({
      questionId: 'question-01',
      page: 1,
      pageSize: 20,
    })

    expect(result.value?.comments).toHaveLength(3)
    expect(result.value.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          props: expect.objectContaining({
            author: expect.objectContaining({
              name: 'John Doe',
            }),
            commentId: comment1.id,
          }),
        }),
        expect.objectContaining({
          props: expect.objectContaining({
            author: expect.objectContaining({
              name: 'John Doe',
            }),
            commentId: comment2.id,
          }),
        }),
        expect.objectContaining({
          props: expect.objectContaining({
            author: expect.objectContaining({
              name: 'John Doe',
            }),
            commentId: comment3.id,
          }),
        }),
      ]),
    )
  })

  it('should be able to fetch paginated question comments', async () => {
    const student = makeStudent({ name: 'John Doe' })

    inMemoryStudentsRepository.items.push(student)

    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          authorId: student.id,
          questionId: new UniqueEntityId('question-01'),
        }),
      )
    }

    const result = await sut.execute({
      questionId: 'question-01',
      page: 2,
      pageSize: 20,
    })

    expect(result.value?.comments).toHaveLength(2)
  })
})
