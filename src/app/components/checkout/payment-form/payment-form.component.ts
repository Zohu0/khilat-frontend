// src/app/components/checkout/payment-form/payment-form.component.ts
import {
  Component, Input, Output, EventEmitter,
  OnDestroy, AfterViewInit, NgZone, ChangeDetectorRef
} from '@angular/core';
import { CommonModule }  from '@angular/common';
import { CheckoutForm }  from '../checkout.component';
import { environment }   from '../../../../environments/environments';

declare var Razorpay: any;

export type ErrorType = 'declined' | 'validation' | 'generic' | null;

@Component({
  selector:    'app-payment-form',
  standalone:  true,
  imports:     [CommonModule],
  templateUrl: './payment-form.component.html',
  styleUrl:    './payment-form.component.css',
})
export class PaymentFormComponent implements AfterViewInit, OnDestroy {

  @Input()  form!:            CheckoutForm;
  @Input()  razorpayOrderId!: string;    // ← clientSecret ki jagah ye aaya
  @Input()  total = 0;

  @Output() goBack         = new EventEmitter<void>();
  @Output() paymentSuccess = new EventEmitter<{ razorpay_payment_id: string }>();
  @Output() paymentFailed  = new EventEmitter<string>();

  // Razorpay popup instant ready hota hai — koi loading nahi
  paymentReady  = true;
  paymentLoading = false;
  errorMessage  = '';
  errorType:    ErrorType = null;

  constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {}
  ngOnDestroy(): void {}

  // ── Razorpay Popup Open ───────────────────────────────────────

  confirmPayment(): void {
    if (this.paymentLoading) return;

    this.paymentLoading = true;
    this.errorMessage   = '';
    this.errorType      = null;

    const options = {
      key:         environment.razorpayKeyId,
      amount:      this.total * 100,          // paise mein (backend bhi karta hai but frontend ke liye)
      currency:    'INR',
      name:        'Khilat Kurtis',
      description: 'Order Payment',
      order_id:    this.razorpayOrderId,      // backend se aaya Razorpay Order ID
      prefill: {
        name:    this.form.fullName,
        email:   this.form.email,
        contact: this.form.phone,
      },
      theme: {
        color: '#FF9494'                      // tera brand color
      },

      // ── Payment SUCCESS ──
      // Note: Webhook already /api/razorpay/webhook se order DB mein save kar dega
      // Frontend ko sirf payment_id chahiye success page ke liye
      handler: (response: any) => {
        this.ngZone.run(() => {
          this.paymentLoading = false;
          this.paymentSuccess.emit({
            razorpay_payment_id: response.razorpay_payment_id
          });
          this.cdr.detectChanges();
        });
      },

      // ── User ne popup band kiya (cancel) ──
      modal: {
        ondismiss: () => {
          this.ngZone.run(() => {
            this.paymentLoading = false;
            this.errorType      = 'generic';
            this.errorMessage   = 'Payment cancelled. Please try again.';
            this.cdr.detectChanges();
          });
        }
      }
    };

    try {
      const rzp = new Razorpay(options);

      // ── Payment FAIL event ──
      rzp.on('payment.failed', (response: any) => {
        this.ngZone.run(() => {
          this.paymentLoading = false;
          this.errorType      = 'declined';
          this.errorMessage   = response.error?.description
            || 'Payment failed. Please try again.';
          this.paymentFailed.emit(this.errorMessage);
          this.cdr.detectChanges();
        });
      });

      rzp.open();

    } catch (e) {
      this.paymentLoading = false;
      this.errorType      = 'generic';
      this.errorMessage   = 'Could not open payment window. Please refresh and try again.';
      this.cdr.detectChanges();
    }
  }

  onGoBack(): void {
    this.goBack.emit();
  }
}