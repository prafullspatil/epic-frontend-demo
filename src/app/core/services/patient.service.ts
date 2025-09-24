import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { PATIENT_CONDITION, PATIENT_DETAILS, PATIENT_OBSERVATION } from '../constants/api-endpoints';
import { FHIRBundle, FHIRPatient, FHIRObservation, FHIRCondition } from '../models/fhir-patient.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private readonly http = inject(HttpClient)

  constructor() { }

  getPatientData(): Observable<FHIRPatient> {
    return this.http.get<FHIRPatient>(`${PATIENT_DETAILS}?id=${environment.PATIENT_ID}`);
  }

  getPatientObservations(category: string): Observable<FHIRBundle<FHIRObservation>> {
    return this.http.get<FHIRBundle<FHIRObservation>>(`${PATIENT_OBSERVATION}?patient=${environment.PATIENT_ID}&category=${category}`);
  }

  getPatientConditions(): Observable<FHIRBundle<FHIRCondition>> {
    return this.http.get<FHIRBundle<FHIRCondition>>(`${PATIENT_CONDITION}?patient=${environment.PATIENT_ID}`);
  }
}
