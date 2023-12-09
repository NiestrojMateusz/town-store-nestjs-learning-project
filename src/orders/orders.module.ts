import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ProductModule } from 'src/product/product.module';
import { OrderModel } from './model/order.model';
import { OrdersRepository } from './orders.repository';

@Module({
  imports: [ProductModule],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    {
      provide: 'OrderModel',
      useValue: OrderModel,
    },
    OrdersRepository,
  ],
})
export class OrdersModule {}
