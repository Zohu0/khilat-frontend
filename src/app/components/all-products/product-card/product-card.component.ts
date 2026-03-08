// product-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ProductVariant {
  id: number;
  size: string;
  price: number;
  stock: number;
}

export interface ProductImage {
  id: number;
  imageUrl: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  trending: string;
  createdAt: string;
  isActive: boolean;
  category: Category;
  productImages: ProductImage[];
  variants: ProductVariant[];
}

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() viewMode: 'grid' | 'list' = 'grid';
  @Input() visible = false;
  @Input() animationDelay = '0s';

  // Computed/passed-in display values
  @Input() productImage = '';
  @Input() isFullyOutOfStock = false;
  @Input() isNew = false;
  @Input() selectedPrice = '';
  @Input() selectedVariantSize = '';
  @Input() selectedVariantId: number | null = null;
  @Input() selectedVariantStock: number | null = null;
  @Input() qty = 1;
  @Input() cartState: 'idle' | 'loading' | 'added' = 'idle';
  @Input() cartError = '';

  @Output() cardClick = new EventEmitter<number>();
  @Output() variantChange = new EventEmitter<{ productId: number; size: string }>();
  @Output() incrementQty = new EventEmitter<number>();
  @Output() decrementQty = new EventEmitter<number>();
  @Output() addToCart = new EventEmitter<Product>();
}