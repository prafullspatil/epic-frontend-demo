export interface FHIRPatient {
  resourceType: 'Patient';
  id: string;
  name: {
    use: string;
    family: string;
    given: string[];
  }[];
  gender: 'male' | 'female' | 'other' | 'unknown';
  birthDate: string;
  photo?: {
    url: string;
  }[];
  telecom: {
    system: string;
    value: string;
    use: string;
  }[];
  address: {
    use: string;
    line: string[];
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }[];
}

export interface FHIRObservation {
  resourceType: 'Observation';
  id: string;
  status: string;
  category: {
    coding: {
      system: string;
      code: string;
      display: string;
    }[];
  }[];
  code?: {
    text: string;
  };
  subject: {
    reference: string;
  };
  effectiveDateTime: string;
  valueQuantity: {
    value: number;
    unit: string;
  };
}

export interface FHIRCondition {
  resourceType: 'Condition';
  id: string;
  clinicalStatus: {
    coding: {
      system: string;
      code: string;
      display: string;
    }[];
  };
  category: {
    coding: {
      system: string;
      code: string;
      display: string;
    }[];
  }[];
  code?: {
    text: string;
  };
  subject: {
    reference: string;
  };
  onsetDateTime: string;
}

export interface FHIRBundle<T> {
  resourceType: 'Bundle';
  type: string;
  total: number;
  entry: {
    fullUrl: string;
    resource: T;
  }[];
}
