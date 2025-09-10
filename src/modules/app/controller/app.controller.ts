import { Controller, Get, Param, Query, BadRequestException } from '@nestjs/common';
import { AppService } from '../service/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("greeting/:name")
  greetingUser(@Param() params: any): string {
    console.log(params)
    return 'Hi Mr,  + ${params.name}';
  }

  @Get("users")
  users(@Query() params: any): any {
    console.log(params)
    const permitidos = ['limit', 'offset'];
    for (const query in params) {
      if (!permitidos.includes(query)) {
        return 'No se permite el parametro';
      }
    }
    return [];
  }
}

