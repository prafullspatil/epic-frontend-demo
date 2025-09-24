import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService } from '../../core/services/patient.service';
import { FHIRPatient, FHIRObservation, FHIRCondition } from '../../core/models/fhir-patient.model';
import { forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  patient: FHIRPatient | null = null;
  observations: FHIRObservation[] = [];
  conditions: FHIRCondition[] = [];
  isLoading = true;
  patientInfo: { [key: string]: string } = {};

  private readonly patientService: PatientService = inject(PatientService);

  ngOnInit(): void {
    this.loadAllPatientData();
  }

  loadAllPatientData(): void {
    this.isLoading = true;
    forkJoin({
      patient: this.patientService.getPatientData(),
      observations: this.patientService.getPatientObservations('lab'),
      conditions: this.patientService.getPatientConditions(),
    })
      .pipe(
        map(({ patient, observations, conditions }) => {
          return {
            patientResource: patient,
            observationResources: observations.entry?.map(e => e.resource) ?? [],
            conditionResources: conditions.entry?.map(e => e.resource) ?? [],
          };
        })
      )
      .subscribe(({ patientResource, observationResources, conditionResources }) => {
        this.patient = patientResource;
        this.observations = observationResources;
        this.conditions = conditionResources;
        if (this.patient) {
          this.patientInfo = this.createPatientInfo(this.patient);
        }
        this.isLoading = false;
      });
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

  getVitalIcon(vitalName: string): string {
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

