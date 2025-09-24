import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PatientService } from '../../../core/services/patient.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-authorize',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './authorize.component.html',
  styleUrl: './authorize.component.scss'
})
export class AuthorizeComponent implements OnInit, OnDestroy {
  mrn: string = '';
  patient: any = null;
  isLoading: boolean = false;

  private mrnSubject = new Subject<string>();
  private mrnSubscription!: Subscription;

  constructor(private patientService: PatientService, private router: Router) {}

  ngOnInit(): void {
    this.mrnSubscription = this.mrnSubject.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        this.patient = null;
      }),
      switchMap(mrn => {
        if (!mrn) {
          this.isLoading = false;
          return [];
        }
        return this.patientService.getPatientByMrn(mrn);
      })
    ).subscribe(data => {
      this.isLoading = false;
      if (data && data.entry && data.entry.length > 0) {
        const patientResource = data.entry[0].resource;
        this.patient = {
          id: patientResource.id,
          name: patientResource.name[0].text,
          dob: patientResource.birthDate,
          gender: patientResource.gender,
          mrn: this.mrn,
          contact: patientResource.telecom?.find((t: any) => t.system === 'phone')?.value,
          address: patientResource.address[0].text.replace(/\r\n/g, ', ')
        };
      } else {
        this.patient = null;
        if (this.mrn) {
          console.error('Patient not found for the given MRN.');
        }
      }
    });
  }

  onMrnChange(mrn: string) {
    this.mrn = mrn;
    this.mrnSubject.next(mrn);
  }

  clearSearch() {
    this.mrn = '';
    this.patient = null;
    this.mrnSubject.next('');
  }

  confirmPatient() {
    if (this.patient && this.patient.id) {
      this.router.navigate(['/dashboard/home', { patientId: this.patient.id }]);
    }
  }

  ngOnDestroy(): void {
    if (this.mrnSubscription) {
      this.mrnSubscription.unsubscribe();
    }
  }
}
