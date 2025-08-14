import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import FHIR from 'fhirclient';

@Component({
  selector: 'app-redirect',
  imports: [CommonModule],
  templateUrl: './redirect.component.html',
  styleUrl: './redirect.component.scss',
})
export class RedirectComponent implements OnInit {
  patient: any = null;
  error: string = '';
  observations: any[] = [];
  conditions: any[] = [];
  medications: any[] = [];

  async ngOnInit() {
    console.log('Redirect component loaded...');
    try {
      // Wait until OAuth handshake completes and the client is ready
      const client = await FHIR.oauth2.ready();
      console.log('FHIR client ready:', client);
      // Fetch the currently logged-in patient's resource
      const patientData = await client.patient.read();
      this.patient = patientData;

      console.log('Patient data:', patientData);
      const observations = await client.request('Observation?patient=' + patientData.id);
      this.observations = observations;
      console.log('Observations:', observations);
    } catch (err: any) {
      console.error('Error fetching patient:', err);
      this.error = err?.message || 'Failed to load patient data.';
    }
  }
}
