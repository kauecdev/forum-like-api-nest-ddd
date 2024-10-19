import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { InMemoryStudentsRepository } from './in-memory-students-repository'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public items: QuestionComment[] = []

  constructor(private studentsRepository: InMemoryStudentsRepository) {}

  async findById(id: string): Promise<QuestionComment | null> {
    const questionComment = this.items.find(
      (questionComment) => questionComment.id.toString() === id,
    )

    if (!questionComment) {
      return null
    }

    return questionComment
  }

  async findManyByQuestionId(
    questionId: string,
    { page, pageSize = 20 }: PaginationParams,
  ) {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * pageSize, page * pageSize)

    return questionComments
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page, pageSize = 20 }: PaginationParams,
  ) {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * pageSize, page * pageSize)
      .map((questionComment) => {
        const author = this.studentsRepository.items.find((student) =>
          student.id.equals(questionComment.authorId),
        )

        if (!author) {
          throw new Error(
            `Author with ID "${questionComment.authorId.toString()}" does not exist.`,
          )
        }

        return CommentWithAuthor.create({
          commentId: questionComment.id,
          content: questionComment.content,
          createdAt: questionComment.createdAt,
          updatedAt: questionComment.udpatedAt,
          author: {
            id: questionComment.authorId,
            name: author.name,
          },
        })
      })

    return questionComments
  }

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment)
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    const itemToDeleteIndex = this.items.findIndex(
      (item) => item.id === questionComment.id,
    )

    this.items.splice(itemToDeleteIndex, 1)
  }
}
