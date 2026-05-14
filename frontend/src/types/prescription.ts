export type PrescriptionStatus = 'PENDING' | 'CONSUMED';

export type PrescriptionItem = {
  id: string;
  prescriptionId: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string | null;
  createdAt: string;
};

export type PrescriptionUser = {
  id: string;
  name: string;
  email: string;
};

export type PrescriptionDoctor = {
  id: string;
  userId: string;
  specialty?: string | null;
  user: PrescriptionUser;
};

export type PrescriptionPatient = {
  id: string;
  userId: string;
  birthDate?: string | null;
  user: PrescriptionUser;
};

export type Prescription = {
  id: string;
  code: string;
  status: PrescriptionStatus;
  notes?: string | null;
  consumedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  doctorId: string;
  patientId: string;
  doctor: PrescriptionDoctor;
  patient: PrescriptionPatient;
  items: PrescriptionItem[];
};