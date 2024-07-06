import { PartialType } from '@nestjs/mapped-types';
import { CreateCinemaChainDto } from './create-cinema_chain.dto';

export class UpdateCinemaChainDto extends PartialType(CreateCinemaChainDto) {}
