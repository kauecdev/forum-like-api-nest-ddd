import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import { Attachment } from '../attachment'
import { Slug } from './slug'

export interface QuestionDetailsProps {
  questionId: UniqueEntityId
  title: string
  content: string
  slug: Slug
  author: {
    id: UniqueEntityId
    name: string
  }
  attachments: Attachment[]
  bestAnswerId?: UniqueEntityId | null
  createdAt: Date
  updatedAt?: Date | null
}

export class QuestionDetails extends ValueObject<QuestionDetailsProps> {
  get questionId() {
    return this.props.questionId
  }

  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }

  get slug() {
    return this.props.slug
  }

  get author() {
    return this.props.author
  }

  get attachments() {
    return this.props.attachments
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: QuestionDetailsProps) {
    return new QuestionDetails(props)
  }
}
