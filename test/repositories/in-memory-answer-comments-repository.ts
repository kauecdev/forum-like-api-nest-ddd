import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { InMemoryStudentsRepository } from './in-memory-students-repository'

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public items: AnswerComment[] = []

  constructor(private studentsRepository: InMemoryStudentsRepository) {}

  async findById(id: string): Promise<AnswerComment | null> {
    const answerComment = this.items.find(
      (answerComment) => answerComment.id.toString() === id,
    )

    if (!answerComment) {
      return null
    }

    return answerComment
  }

  async findManyByAnswerId(
    answerId: string,
    { page, pageSize = 20 }: PaginationParams,
  ) {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * pageSize, page * pageSize)

    return answerComments
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page, pageSize = 20 }: PaginationParams,
  ) {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * pageSize, page * pageSize)
      .map((answerComment) => {
        const author = this.studentsRepository.items.find((student) =>
          student.id.equals(answerComment.authorId),
        )

        if (!author) {
          throw new Error(
            `Author with ID "${answerComment.authorId.toString()}" does not exist.`,
          )
        }

        return CommentWithAuthor.create({
          commentId: answerComment.id,
          content: answerComment.content,
          createdAt: answerComment.createdAt,
          updatedAt: answerComment.udpatedAt,
          author: {
            id: answerComment.authorId,
            name: author.name,
          },
        })
      })

    return answerComments
  }

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment)
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    const itemToDeleteIndex = this.items.findIndex(
      (item) => item.id === answerComment.id,
    )

    this.items.splice(itemToDeleteIndex, 1)
  }
}
