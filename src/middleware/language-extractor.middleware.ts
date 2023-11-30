import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

import acceptLanguage from 'accept-language';
import { LanguageService } from 'src/shared/language/language.service';
acceptLanguage.languages(['en', 'pl']);

@Injectable()
export class LanguageExtractorMiddleware implements NestMiddleware {
  constructor(languageService: LanguageService) {
    acceptLanguage.languages(
      languageService.supportedLanguages() as unknown as string[],
    );
  }

  use(req: Request, res: Response, next: () => void) {
    req['language'] = acceptLanguage.get(req.headers['accept-language']);
    next();
  }
}
