import { environment } from "../../../environments/environment.development";

export const PATIENT_BY_MRN = environment.ENDPOINT_URL + '/api/v1/patient-by-mrn';
export const PATIENT_DETAILS = environment.ENDPOINT_URL + '/api/v1/patient';
export const PATIENT_OBSERVATION = environment.ENDPOINT_URL + '/api/v1/patient-observation';
export const PATIENT_CONDITION = environment.ENDPOINT_URL + '/api/v1/patient-condition';
export const ASK_PATIENT_SUMMARY = environment.ENDPOINT_URL + '/api/v1/chat/ask';


