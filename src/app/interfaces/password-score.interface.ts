import { PasswordMark } from 'src/app/enums/password-mark.enum';

export interface PasswordScore {
  percentageScore: number;
  mark: PasswordMark;
}
