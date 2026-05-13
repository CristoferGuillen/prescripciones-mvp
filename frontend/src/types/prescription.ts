export type PrescriptionStatus = 'PENDING' | 'CONSUMED';

export type PrescriptionItem = {
  id: string;
  name: string;
  dosage: string;
  quantity: string;
  instructions?: string | null;
};

export type Prescription = {
  id: string;
  code: string;
  status: PrescriptionStatus;
  notes?: string | null;
  createdAt: string;
  consumedAt?: string | null;
  items: PrescriptionItem[];
};