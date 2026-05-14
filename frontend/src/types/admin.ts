export type AdminMetrics = {
  totals: {
    doctors: number;
    patients: number;
    prescriptions: number;
  };
  byStatus: {
    pending: number;
    consumed: number;
  };
  byDay: {
    date: string;
    count: number;
  }[];
};