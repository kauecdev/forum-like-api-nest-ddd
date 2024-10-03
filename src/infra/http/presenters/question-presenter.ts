import { Question } from '@/domain/forum/enterprise/entities/question'

export class QuestionPresenter {
  static toHTTP(question: Question) {
    return {
      id: question.id.toString(),
      title: question.title,
      content: question.content,
      slug: question.slug.value,
      bestAnswerId: question.bestAnswerId
        ? question.bestAnswerId.toString()
        : null,
      createdAt: question.createdAt,
      updatedAt: question.udpatedAt,
    }
  }
}
