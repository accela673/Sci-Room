import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class ListParamsDto {
  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }: { value: number }) =>
    value > 0 && value < 10000 ? value : 1,
  )
  page = 1;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }: { value: number }) =>
    value > 0 && value < 100 ? value : 20,
  )
  limit = 20;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @Transform(({ value }) => (value === 'desc' ? 'DESC' : 'ASC'))
  @IsOptional()
  order: 'ASC' | 'DESC' = 'ASC';

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  orderField = 'id';

  getOrderedField() {
    return ['id', 'created_at', 'updated_at'].includes(this.orderField)
      ? this.orderField
      : 'id';
  }

  public countOffset(): number {
    return (this.page - 1) * this.limit;
  }
}
