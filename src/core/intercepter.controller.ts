import { Public } from '@/auth/constants';
import { Controller, Get, Req, Res } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { URL } from 'url';
import { IntercepterService } from './intercepter.service';

// @Controller('*')
// export class IntercepterController {
//   constructor() {}
//   @Get()
//   async getApp(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
//     // res.send('html');
//     const urlObj = new URL(req.url, `http://${req.headers.host}`);
//     console.log('urlObj===>', urlObj);
//     res.send(req.headers.host);
//   }
// }

@Controller()
export class IntercepterController {
  constructor(private readonly intercepterService: IntercepterService) {}

  @Get('*')
  @Public()
  async getApp(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const urlObj = new URL(req.url, `http://${req.headers.host}`);

    if (urlObj.pathname === '/favicon.ico') return res.send('ico');

    const html = await this.intercepterService.readHtml(urlObj);

    if (!html) return res.send('404');

    res.headers({
      'Content-Type': 'text/html',
    });
    res.send(html);
  }
}
