import { META_DATA } from '../constants.enum';
import { SetMetadata } from '@nestjs/common';

export const Public = (isPublic = true) => SetMetadata(META_DATA.IS_PUBLIC, isPublic);
