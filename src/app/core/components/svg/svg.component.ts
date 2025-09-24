import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-svg',
  standalone: true,
  imports: [],
  templateUrl: './svg.component.html',
  styleUrl: './svg.component.scss'
})
export class SvgComponent implements OnInit {
  @Input() iconName!: string;
  @Input() className!: string;
  @Input() link!: string;

  ngOnInit(): void {
    this.link = `/assets/images/${this.iconName}.svg#${this.iconName}`;
  }
}
