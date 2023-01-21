import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'

@Injectable()
export class UtilsService {
  successMessages = {
    emailSent: 'Email enviado com sucesso',
    redefinePasswordEmailSent: 'Uma nova senha foi enviada para o seu e-mail',
    usersExists: 'Usuário existe',
    available: 'Disponível',
  }

  errorMessages = {
    refreshTokenInvalid: 'Acesso invalidado, refaça o login',
    mailNotSent: 'Não foi possível enviar o e-mail',
    notPendingRow: 'Este registro não está pendente',
    deletedRowFound: 'Este registro foi deletado',
    invalidCredentials: 'Email ou senha inválidos',
    incorrectAnswer: 'Resposta incorreta',
    expiredCaptcha: 'Captcha expirado',
    incorrectCaptchaResult: 'Reposta incorreta',
    nameAlreadyExists: 'Já possui um registro utilizando este nome',
    userAlreadyExists: 'Já possui um registro utilizando este user',
    cpfAlreadyExists: 'Já possui um registro utilizando este CPF',
    roleContainsUsers:
      'Não é permitido deletar pois possui usuários associados',
    deactivatedUser: 'Usuário desativado',
    dontHavePermission:
      'Acesso negado para este recurso. Certifique-se de ter permissão de acesso',
    notRegisteredUser: 'Usuário não cadastrado',
    operationNotAllowed: 'Operação não permitida',
    actionNotAllowed: 'Erro, ação não permitida',
    labelAlreadyExists: 'Já possui um registro utilizando essa label',
    codeAlreadyExists: 'Já possui um registro utilizando esse code',
    errorQuantity:
      'Quantidade de IMEIS deve ser igual a quantidade de produtos',
    linkedValue: 'Este registro está vinculado a outros, ação não permitida!',
    errorMonthBilling: 'Error, periodo de faturamento já cadastrado',
    entityNotFound: (entity: string, finalLetter: 'a' | 'o' | 'o(a)' = 'a') =>
      `${entity} não encontrad${finalLetter}`,
  }

  throwErrorBadReqException(msg: string) {
    return new BadRequestException({
      statusCode: 400,
      message: msg,
      error: 'Bad Request',
    })
  }

  throwForbiddenException(msg: string) {
    return new ForbiddenException({
      statusCode: 403,
      message: msg,
      error: 'Forbidden',
    })
  }

  throwNotFoundException(msg: string) {
    return new NotFoundException({
      statusCode: 404,
      message: msg,
      error: 'Not Found',
    })
  }

  throwValidateHttpException(
    msg: string,
    validateObj: Record<string, unknown>
  ) {
    return new HttpException(
      {
        statusCode: 422,
        message: msg,
        error: 'Unprocessable Entity',
        context: validateObj,
      },
      422
    )
  }

  throwValidateWithObject(
    msg: string,
  ) {
    return new HttpException(
      {
        statusCode: 400,
        message: msg,
        error: 'Bad Request',
      },
      400
    )
  }


  throwExpiredException(msg: string) {
    return new UnauthorizedException({
      statusCode: 401,
      message: msg,
      error: 'Expired',
    })
  }

  throwInvalidRefreshTokenException(msg: string) {
    return new UnauthorizedException({
      statusCode: 401,
      message: msg,
      error: 'InvalidRefreshToken',
    })
  }
  throwUnauthorizedException(msg: string) {
    return new UnauthorizedException({
      statusCode: 401,
      message: msg,
      error: 'Unauthorized',
    })
  }
  entityNotFound(
    entity: string,
    finalLetter: 'a' | 'o' | 'o(a)' = 'a',
  ): NotFoundException {
    return this.notFoundExceptionEntity(
      this.errorMessages.entityNotFound(entity, finalLetter),
    )
  }

  notFoundExceptionEntity(...msg: string[]): NotFoundException {
    return new HttpException(
      {
        statusCode: 204,
        message: [...msg],
        error: 'Not Found',
      },
      204,
    )
  }
  notFoundException(...msg: string[]): NotFoundException {
    return new NotFoundException({
      statusCode: 404,
      message: [...msg],
      error: 'Not Found',
    })
  }


  calcTime(offset) {
    const d = new Date()
    const utc = d.getTime() + d.getTimezoneOffset() * 60000
    const nd = new Date(utc + 3600000 * offset)

    return nd
  }

  dataAtualFormatada(data: Date) {
    const dia = data.getDate().toString(),
      diaF = (dia.length == 1) ? '0' + dia : dia,
      mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
      mesF = (mes.length == 1) ? '0' + mes : mes,
      anoF = data.getFullYear();
    return diaF + "/" + mesF + "/" + anoF;
  }

  applyFilter(query: any, r: any) {
    Object.keys(query).forEach((item) => {
      if (query[item]) {
        r.where(item).equals(query[item])
      }
    });
    return r
  }
  applyFilterAggregate(query: any) {
    let obj = undefined
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) {
        obj = {
          ...obj,
          [key]: value
        }
      }
    }
    if (obj !== undefined) {
      obj = {
        "$match": {
          ...obj
        }
      }
    } else obj = {
      "$match": {
        _id: { $exists: true }
      }
    }
    return obj
  }
}
