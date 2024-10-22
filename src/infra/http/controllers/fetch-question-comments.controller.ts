import { BadRequestException, Get, Param, Query } from '@nestjs/common'
import { Controller } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments'
import { CommentWithAuthorPresenter } from '../presenters/comment-with-author-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const pageSizeQueryParamSchema = z
  .string()
  .optional()
  .default('20')
  .transform(Number)
  .pipe(z.number().min(20))

const pageQueryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)
const pageSizeQueryValidationPipe = new ZodValidationPipe(
  pageSizeQueryParamSchema,
)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>
type pageSizeQueryParamSchema = z.infer<typeof pageSizeQueryParamSchema>

@Controller('/questions/:questionId/comments')
export class FetchQuestionCommentsController {
  constructor(private fetchQuestionComments: FetchQuestionCommentsUseCase) {}

  @Get()
  async handle(
    @Query('page', pageQueryValidationPipe) page: PageQueryParamSchema,
    @Query('pageSize', pageSizeQueryValidationPipe)
    pageSize: pageSizeQueryParamSchema,
    @Param('questionId') questionId: string,
  ) {
    const result = await this.fetchQuestionComments.execute({
      page,
      pageSize,
      questionId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const comments = result.value.comments

    return {
      comments: comments.map(CommentWithAuthorPresenter.toHTTP),
    }
  }
}
