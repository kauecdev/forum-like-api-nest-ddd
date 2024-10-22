import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { AttachmentPresenter } from './attachment-presenter'

export class QuestionDetailsPresenter {
  static toHTTP(questionDetails: QuestionDetails) {
    return {
      id: questionDetails.questionId.toString(),
      title: questionDetails.title,
      content: questionDetails.content,
      slug: questionDetails.slug.value,
      bestAnswerId: questionDetails.bestAnswerId
        ? questionDetails.bestAnswerId.toString()
        : null,
      authorId: questionDetails.author.id,
      authorName: questionDetails.author.name,
      attachments: questionDetails.attachments.map(AttachmentPresenter.toHTTP),
      createdAt: questionDetails.createdAt,
      updatedAt: questionDetails.updatedAt,
    }
  }
}
