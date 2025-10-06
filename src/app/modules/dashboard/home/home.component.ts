import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin, map, of } from 'rxjs';
import { PatientService } from '../../../core/services/patient.service';
import { FHIRCondition, FHIRObservation, FHIRPatient } from '../../../core/models/fhir-patient.model';
import { SidebarComponent } from '../../../shared/sidebar/sidebar.component';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { SummaryModalComponent } from '../../../shared/summary-modal/summary-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SidebarComponent, DialogModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  patient: FHIRPatient | null = null;
  observations: FHIRObservation[] = [];
  conditions: FHIRCondition[] = [];
  isLoading = true;
  patientInfo: { [key: string]: string } = {};
  readonly dialog = inject(Dialog);

  private readonly patientService: PatientService = inject(PatientService);
  private readonly router: Router = inject(Router);

  ngOnInit(): void {
    const patientId = history?.state?.patientId;
    if (patientId) {
      this.isLoading = true;
      this.loadAllPatientData(patientId).subscribe(data => {
        if (data) {
          this.patient = data?.patientResource;
          this.observations = data?.observationResources;
          this.conditions = data?.conditionResources;
          if (this.patient) {
            this.patientInfo = this.createPatientInfo(this.patient);
          }
        }
        this.isLoading = false;
      });
    } else {
      this.isLoading = false;
      // Handle case where patientId is not available, maybe redirect or show an error
      console.error('Patient ID not found in navigation state.');
    }
  }

  loadAllPatientData(patientId: string) {
    return forkJoin({
      patient: this.patientService.getPatientData(patientId),
      observations: this.patientService.getPatientObservations(patientId, 'lab'),
      conditions: this.patientService.getPatientConditions(patientId),
    }).pipe(
      map(({ patient, observations, conditions }) => {
        return {
          patientResource: patient,
          observationResources: observations.entry?.map(e => e?.resource) ?? [],
          conditionResources: conditions.entry?.map(e => e?.resource) ?? [],
        };
      })
    );
  }

  openSummaryModel() {
    if (this.patient) {
      this.dialog.open<string>(SummaryModalComponent, {
        width: '700px',
        data: {
          patient: this.patient,
          observations: this.observations,
          conditions: this.conditions
        }
      });
    }
  }

  private createPatientInfo(patient: FHIRPatient): { [key: string]: string } {
    const info: { [key: string]: string } = {
      gender: patient.gender,
      patientId: patient.id,
    };

    const homeAddress = patient.address?.find(a => a.use === 'home');
    if (homeAddress) {
      info['address'] = `${homeAddress.line.join(', ')}, ${homeAddress.city}, ${homeAddress.state} ${homeAddress.postalCode}`;
    }

    const email = patient.telecom?.find(t => t.system === 'email');
    if (email) {
      info['email'] = email?.value;
    }

    const phone = patient.telecom?.find(t => t.use === 'mobile');
    if (phone) {
      info['phone'] = phone?.value;
    }

    return info;
  }

  objectKeys(obj: object): string[] {
    return Object.keys(obj);
  }

  getAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  getVitalIcon(vitalName: string | undefined): string {
    if (!vitalName) {
      return '🩺'; // Default icon for unknown vital
    }
    switch (vitalName.toLowerCase()) {
      case 'heart rate':
        return '❤️';
      case 'body temperature':
        return '🌡️';
      case 'blood pressure':
        return '🩸';
      default:
        return '🩺';
    }
  }
}
