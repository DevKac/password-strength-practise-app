import { ChangeDetectionStrategy } from '@angular/core';
import { Component, Input } from '@angular/core';

import { PasswordScore } from 'src/app/interfaces/password-score.interface';
import { PasswordMark } from 'src/app/enums/password-mark.enum';

@Component({
  selector: 'app-password-strength',
  templateUrl: './password-strength.component.html',
  styleUrls: ['./password-strength.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordStrengthComponent {
  @Input() public passwordScore: PasswordScore | undefined;
  public passwordMark: typeof PasswordMark = PasswordMark;
}
