import { IsString, IsOptional, IsNotEmpty, IsBoolean, IsArray } from 'class-validator';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  section: string;

  @IsString()
  @IsNotEmpty()
  label: string;

  @IsBoolean()
  @IsNotEmpty()
  isOnCalendar: boolean;

  @IsString()
  @IsOptional()
  day?: string;

  @IsString()
  @IsNotEmpty()
  createdBy: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  assignedUsers?: string[];
}
