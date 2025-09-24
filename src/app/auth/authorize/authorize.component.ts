import { Component } from '@angular/core';
import { SvgComponent } from '../../core/components/svg/svg.component';

@Component({
  selector: 'app-authorize',
  standalone: true,
  imports: [SvgComponent],
  templateUrl: './authorize.component.html',
  styleUrl: './authorize.component.scss'
})
export class AuthorizeComponent {

  authorize() {
      
    }
}
