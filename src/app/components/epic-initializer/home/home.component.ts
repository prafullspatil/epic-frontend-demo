import { Component, OnInit } from '@angular/core';
import FHIR from 'fhirclient';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{

  ngOnInit(): void {
    this.authorize()
  }

  authorize() {
    FHIR.oauth2.authorize({
      iss: environment.epicFhirBaseUrl,
      clientId: environment.epicClientId,
      redirectUri: environment.epicRedirectUri,
      scope: environment.epicScope
    });
  }
}
