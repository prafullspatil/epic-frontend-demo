import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FHIRPatient, FHIRObservation, FHIRCondition } from '../../core/models/fhir-patient.model';
import { PatientService } from '../../core/services/patient.service';

@Component({
  selector: 'app-summary-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary-modal.component.html',
  styleUrls: ['./summary-modal.component.scss']
})
export class SummaryModalComponent implements OnInit {
  readonly dialogRef = inject(DialogRef<string>);
  readonly patientService = inject(PatientService);
  data: { patient: FHIRPatient, observations: FHIRObservation[], conditions: FHIRCondition[] } = inject(DIALOG_DATA);
  
  isLoading = false;
  parsedSummary: { type: 'title' | 'item' | 'subitem' | 'paragraph', content: string }[] = [];

  ngOnInit(): void {
    this.isLoading = true;
    this.patientService.getPatientSummary(this.data.patient, this.data.observations, this.data.conditions)
      .subscribe(summary => {
        this.parsedSummary = this.parseSummary(summary.answer);
        this.isLoading = false;
      });
  }

  private parseSummary(answer: string): { type: 'title' | 'item' | 'subitem' | 'paragraph', content: string }[] {
    const lines = answer.split('\n').filter(line => line.trim().length > 0);
    const structure: { type: 'title' | 'item' | 'subitem' | 'paragraph', content: string }[] = [];

    lines.forEach(line => {
      const cleanedLine = line.replace(/\[[\d\]\[]+\]/g, '').trim();
      
      if (cleanedLine.startsWith('**') && cleanedLine.endsWith('**')) {
        structure.push({ type: 'title', content: cleanedLine.replace(/\*\*/g, '') });
      } else if (cleanedLine.startsWith('- **')) {
        const content = cleanedLine.substring(2).replace(/\*\*/g, '');
        const parts = content.split(':');
        structure.push({ type: 'item', content: `<strong>${parts[0]}:</strong>${parts.slice(1).join(':')}` });
      } else if (cleanedLine.startsWith('  - ')) {
        structure.push({ type: 'subitem', content: cleanedLine.substring(4) });
      } else if (cleanedLine.startsWith('- ')) {
        structure.push({ type: 'item', content: cleanedLine.substring(2) });
      } else {
        structure.push({ type: 'paragraph', content: cleanedLine });
      }
    });

    return structure;
  }

  closeModal() {
    this.dialogRef.close();
  }
}
