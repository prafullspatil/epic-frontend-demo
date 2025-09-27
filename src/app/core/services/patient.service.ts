import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ASK_PATIENT_SUMMARY, PATIENT_BY_MRN, PATIENT_CONDITION, PATIENT_DETAILS, PATIENT_OBSERVATION } from '../constants/api-endpoints';
import { FHIRBundle, FHIRPatient, FHIRObservation, FHIRCondition } from '../models/fhir-patient.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private readonly http = inject(HttpClient)

  constructor() { }

  getPatientData(patientId: string): Observable<FHIRPatient> {
    return this.http.get<FHIRPatient>(`${PATIENT_DETAILS}?id=${patientId}`);
  }

  getPatientObservations(patientId: string, category: string): Observable<FHIRBundle<FHIRObservation>> {
    return this.http.get<FHIRBundle<FHIRObservation>>(`${PATIENT_OBSERVATION}?patient=${patientId}&category=${category}`);
  }

  getPatientConditions(patientId: string): Observable<FHIRBundle<FHIRCondition>> {
    return this.http.get<FHIRBundle<FHIRCondition>>(`${PATIENT_CONDITION}?patient=${patientId}`);
  }

  getPatientByMrn(mrn: string): Observable<any> {
      return this.http.get<any>(`${PATIENT_BY_MRN}?identifier=${mrn}`);
    }

  getPatientSummary(patient: FHIRPatient, observations: FHIRObservation[], conditions: FHIRCondition[]): Observable<any> {
    const payload = {
      patient,
      observations,
      conditions
    };
    return this.http.post<any>(ASK_PATIENT_SUMMARY, payload);
  }
}
