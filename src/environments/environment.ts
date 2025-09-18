export const environment = {
    production: false,
    epicClientId: '1ad3a1a0-0d18-4ea4-9b0f-36b7f85f2f4a',
    epicRedirectUri: 'https://b4290512fc22.ngrok-free.app/redirect',
    epicFhirBaseUrl: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4',
    epicAuthUrl: 'https://fhir.epic.com/interconnect-fhir-oauth/oauth2/authorize',
    epicTokenUrl: 'https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token',
    epicScope: 'patient/*.* user/*.* patient/*.write user/*.write Observation.read Condition.read MedicationRequest.read  patient/DocumentReference.read patient/DocumentReference.write patient/DocumentReference.cruds   launch openid fhirUser online_access offline_access'
  };
  