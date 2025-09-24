import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  navItems = [
    { icon: 'grid', path: '/dashboard' },
    { icon: 'users', path: '/patients' },
    { icon: 'chart', path: '/reports' },
    { icon: 'file', path: '/documents' },
    { icon: 'calendar', path: '/appointments' },
    { icon: 'folder', path: '/records' },
  ];

  constructor(private router: Router) {}

  isActive(path: string): boolean {
    return this.router.url === path;
  }
}

