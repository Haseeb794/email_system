import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubscriberService } from '../../services/subscriber.service';
import { Subscriber } from '../../models/subscriber.model';

interface Toast {
  type: 'success' | 'error';
  message: string;
}

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  form: FormGroup;

  subscribers: Subscriber[] = [];
  isLoading = false;
  apiOnline = false;
  apiChecked = false;
  toast: Toast | null = null;
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private fb: FormBuilder,
    private subscriberService: SubscriberService,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.loadSubscribers();
  }

  @HostListener('document:keydown.enter')
  onEnter(): void {
    this.handleSubmit();
  }

  // ── Getters ───────────────────────────────────────────────────────────
  get nameCtrl() {
    return this.form.get('name')!;
  }
  get emailCtrl() {
    return this.form.get('email')!;
  }

  get nameError(): string | null {
    const c = this.nameCtrl;
    if (!c.dirty && !c.touched) return null;
    if (c.hasError('required')) return 'This field is required';
    if (c.hasError('minlength')) return 'Minimum 2 characters';
    return null;
  }

  get emailErrorFull(): string | null {
    const c = this.emailCtrl;
    if (!c.dirty && !c.touched) return null;
    if (c.hasError('required')) return 'This field is required';
    if (c.hasError('email')) return 'Enter a valid email address';
    if (c.hasError('duplicate')) return 'This email is already registered';
    return null;
  }

  // ── Load ──────────────────────────────────────────────────────────────
  loadSubscribers(): void {
    this.subscriberService.getAll().subscribe({
      next: (data) => {
        this.subscribers = data;
        this.apiOnline = true;
        this.apiChecked = true;
        this.cdr.detectChanges();
      },
      error: () => {
        this.apiOnline = false;
        this.apiChecked = true;
        this.cdr.detectChanges();
      },
    });
  }

  // ── Submit ────────────────────────────────────────────────────────────
  handleSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.isLoading) return;

    this.isLoading = true;
    this.toast = null;
    this.cdr.detectChanges();

    const { name, email } = this.form.value;

    this.subscriberService.create({ name: name.trim(), email: email.trim() }).subscribe({
      next: (result) => {
        this.subscribers = [result, ...this.subscribers];
        this.form.reset();
        this.isLoading = false;
        this.showToast(
          'success',
          `Confirmation sent to ${result.email}! Check Mailpit at localhost:8025`,
        );
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 409) {
          this.emailCtrl.setErrors({ duplicate: true });
        } else {
          this.showToast('error', err.message ?? 'Something went wrong. Is the API running?');
        }
        this.cdr.detectChanges();
      },
    });
  }

  // ── Delete ────────────────────────────────────────────────────────────
  deleteSubscriber(id: number): void {
    this.subscriberService.delete(id).subscribe({
      next: () => {
        this.subscribers = this.subscribers.filter((s) => Number(s.id) !== Number(id));
        this.showToast('success', 'Subscriber removed');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.showToast('error', 'Failed to delete subscriber');
        this.cdr.detectChanges();
      },
    });
  }

  // ── Toast ─────────────────────────────────────────────────────────────
  private showToast(type: 'success' | 'error', message: string): void {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toast = { type, message };
    if (type === 'success') {
      this.toastTimer = setTimeout(() => {
        this.toast = null;
        this.cdr.detectChanges();
      }, 5000);
    }
  }

  dismissToast(): void {
    this.toast = null;
    this.cdr.detectChanges();
  }

  getInitial(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  trackBySubscriber(index: number, sub: Subscriber): number {
    return sub.id;
  }
}
