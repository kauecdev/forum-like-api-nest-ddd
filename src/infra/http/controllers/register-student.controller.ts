import {
  BadRequestException,
  ConflictException,
  UsePipes,
} from '@nestjs/common'
import { Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'
import { StudentAlreadyExistsError } from '@/domain/forum/application/use-cases/errors/student-already-exists-error'

const registerStudentBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type RegisterStudentBodySchema = z.infer<typeof registerStudentBodySchema>

@Controller('/accounts')
@UsePipes(new ZodValidationPipe(registerStudentBodySchema))
export class RegisterStudentController {
  constructor(private registerStudent: RegisterStudentUseCase) {}

  @Post()
  async handle(@Body() body: RegisterStudentBodySchema) {
    const { name, email, password } = body

    const result = await this.registerStudent.execute({
      name,
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case StudentAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException()
      }
    }
  }
}
