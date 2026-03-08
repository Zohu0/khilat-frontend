// product-filter-sidebar.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-filter-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-filter-sidebar.component.html',
  styleUrl: './product-filter-sidebar.component.css',
})
export class ProductFilterSidebarComponent {
  @Input() isOpen = false;
  @Input() categories: string[] = [];
  @Input() selectedCategory = '';
  @Input() keyword = '';
  @Input() minPrice: number | null = null;
  @Input() maxPrice: number | null = null;
  @Input() hasActiveFilters = false;

  @Output() closeFilter = new EventEmitter<void>();
  @Output() searchInput = new EventEmitter<string>();
  @Output() clearSearch = new EventEmitter<void>();
  @Output() categoryChange = new EventEmitter<string>();
  @Output() priceChange = new EventEmitter<{ min: number | null; max: number | null }>();
  @Output() clearAll = new EventEmitter<void>();
}