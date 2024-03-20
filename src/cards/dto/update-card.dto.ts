import { IsString, IsOptional, IsDate, IsBoolean } from 'class-validator';

export class UpdateCardDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  label?: string;

  @IsBoolean()
  @IsOptional()
  isOnCalendar?: boolean;

  @IsString()
  @IsOptional()
  day?: string;

  @IsString()
  @IsOptional()
  createdBy?: string;

  @IsOptional()
  @IsString({ each: true })
  assignedUsers?: string[]; 
}
