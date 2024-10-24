import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { QuestionBestAnswerChoosenEvent } from '@/domain/forum/enterprise/events/question-best-answer-choosen'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OnQuestionBestAnswerChoosen implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionBestAnswerChooseNotification.bind(this),
      QuestionBestAnswerChoosenEvent.name,
    )
  }

  private async sendQuestionBestAnswerChooseNotification({
    question,
    bestAnswerId,
  }: QuestionBestAnswerChoosenEvent) {
    const answer = await this.answersRepository.findById(
      bestAnswerId.toString(),
    )

    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: 'Sua resposta foi escolhida!',
        content: `A resposta que você enviou foi escolhida em "${question.title.substring(0, 20).concat('...')}" foi escolhida pelo autor!`,
      })
    }
  }
}
