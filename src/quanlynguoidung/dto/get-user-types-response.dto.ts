import { UserTypeDto } from './user-type.dto';

export class GetUserTypesResponseDto {
  statusCode: number;
  message: string;
  content: UserTypeDto[];
  dateTime: string;
  messageConstants: string | null;
}
