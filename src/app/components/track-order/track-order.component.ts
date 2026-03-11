// track-order/track-order.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TrackOrderResultComponent, OrderTrackingResponse  } from './track-order-result/track-order-result.component';

@Component({
  selector: 'app-track-order',
  standalone: true,
  imports: [CommonModule, FormsModule, TrackOrderResultComponent],
  templateUrl: './track-order.component.html',
  styleUrl: './track-order.component.css'
})
export class TrackOrderComponent {
  trackingKey = '';
  lastTracked = '';
  loading     = false;
  error       = '';
  orderData: OrderTrackingResponse | null = null;

  private readonly API = 'http://localhost:8080/api/order/track';

  constructor(private http: HttpClient) {}

  onTrack(): void {
    const key = this.trackingKey.trim();
    if (!key) {
      this.error = 'Please enter a tracking ID.';
      return;
    }

    this.loading   = true;
    this.error     = '';
    this.orderData = null;

    this.http.get<OrderTrackingResponse>(`${this.API}/${key}`).subscribe({
      next: (res) => {
        this.loading     = false;
        this.orderData   = res;
        this.lastTracked = key;
      },
      error: (err) => {
        this.loading = false;
        this.error   =
          typeof err.error === 'string'
            ? err.error
            : 'No order found with this tracking ID. Please check and try again.';
      }
    });
  }
}