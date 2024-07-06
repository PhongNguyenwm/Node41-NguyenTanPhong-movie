import { PartialType } from '@nestjs/mapped-types';
import { CreateCinemaGroupDto } from './create-cinema_group.dto';

export class UpdateCinemaGroupDto extends PartialType(CreateCinemaGroupDto) {}
