import { Injectable } from '@angular/core';

import { PasswordScore } from 'src/app/interfaces/password-score.interface';
import { PasswordMark } from 'src/app/enums/password-mark.enum';

@Injectable()
export class PasswordStrengthService {
  public readonly passwordScoreMinValue: number = 0;
  public readonly passwordScoreMaxValue: number = 84;

  public getMinPasswordScore(): PasswordScore {
    return {
      percentageScore: this.passwordScoreMinValue,
      mark: PasswordMark.BAD
    }
  }

  public calculatePasswordScore(password: string): PasswordScore {
    const passwordScore: PasswordScore = this.getMinPasswordScore();
    if (!password?.length) {
      return passwordScore;
    }

    let passwordScoreValue: number = this.passwordScoreMinValue;
    passwordScoreValue += this.getScoreWhenRegexpMatches(password, '[a-z]', 10);
    passwordScoreValue += this.getScoreWhenRegexpMatches(password, '[A-Z]', 20);
    passwordScoreValue += this.getScoreWhenRegexpMatches(password, '[0-9]', 10);
    passwordScoreValue += this.getScoreWhenRegexpMatches(password, '[^a-zA-Z0-9\s:]', 20);

    passwordScoreValue *= this.getScoreMultiplierForLength(password);

    passwordScore.percentageScore = this.getScoreAsPercentageValue(passwordScoreValue);
    passwordScore.mark = this.getScoreAsMark(passwordScoreValue);
    return passwordScore;
  }

  public getScoreAsPercentageValue(passwordScoreValue: number): number {
    return Math.floor(passwordScoreValue*100/this.passwordScoreMaxValue);
  }

  public getScoreAsMark(passwordScoreValue: number): PasswordMark {
    if (passwordScoreValue > (0.75 * this.passwordScoreMaxValue)) {
      return PasswordMark.EXCELLENT;
    } else if (passwordScoreValue > (0.5 * this.passwordScoreMaxValue)) {
      return PasswordMark.GOOD;
    } else if (passwordScoreValue > (0.25 * this.passwordScoreMaxValue)) {
      return PasswordMark.AVERAGE;
    } else {
      return PasswordMark.BAD
    }
  }


  private getScoreWhenRegexpMatches(password: string, regexp: string, score: number): number {
    if (!password?.length) {
      return 0;
    }

    const validatedRegExp: RegExp = new RegExp(regexp);
    return password.match(validatedRegExp) ? score : 0;
  }

  private getScoreMultiplierForLength(password: string): number {
    if (!password?.length) {
      return 0;
    }

    if (password.length > 20) {
      return 1.4;
    } else if (password.length > 16) {
      return 1.3;
    } else if (password.length > 12) {
      return 1.2;
    } else if (password.length > 8) {
      return 1.1;
    } else {
      return 1;
    }
  }
}
