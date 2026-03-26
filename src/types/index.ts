export type UserRole = 'client' | 'worker';

export type TradeCategory = 
  | 'construccion'
  | 'tecnicos'
  | 'hogar'
  | 'automotor'
  | 'servicios-varios';

export type Oficio = 
  // Construcción
  | 'albanil'
  | 'pintor'
  | 'techista'
  | 'gasista'
  | 'plomero'
  | 'electricista'
  // Técnicos
  | 'tecnico-celulares'
  | 'tecnico-pc'
  | 'tecnico-notebooks'
  | 'tecnico-tv'
  | 'tecnico-electrodomesticos'
  | 'tecnico-aire-acondicionado'
  | 'tecnico-heladeras'
  | 'tecnico-lavarropas'
  // Hogar
  | 'limpieza'
  | 'jardineria'
  | 'fletes'
  | 'mudanzas'
  | 'armado-muebles'
  // Automotor
  | 'mecanico'
  | 'electricista-automotor'
  | 'gomero'
  | 'cerrajero-automotor'
  // Servicios varios
  | 'cerrajero'
  | 'herrero'
  | 'carpintero'
  | 'soldador';

export type Zone = 
  | 'CABA'
  | 'GBA Sur'
  | 'GBA Norte'
  | 'GBA Oeste'
  | 'La Plata'
  | 'Córdoba'
  | 'Rosario';

export type Urgency = 'normal' | 'hoy' | 'urgente';

export type JobRequestStatus = 'open' | 'in_progress' | 'closed';

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

export type VerificationStatus = 'none' | 'pending' | 'verified';

export interface User {
  uid: string;
  role: UserRole;
  fullName: string;
  email: string;
  phone?: string;
  cityRegion: Zone;
  createdAt: Date;
  updatedAt: Date;
  verificationStatus: VerificationStatus;
  isActive: boolean;
}

export interface WorkerProfile {
  uid: string;
  oficio: Oficio;
  category?: TradeCategory; // Optional for backward compatibility
  zone: Zone;
  description: string;
  availableNow: boolean;
  whatsapp?: string;
  ratingAverage: number;
  totalReviews: number;
  activeProfile: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobRequest {
  id: string;
  clientUid: string;
  oficio: Oficio;
  category?: TradeCategory; // Optional for backward compatibility
  title: string;
  description: string;
  zone: Zone;
  urgency: Urgency;
  contactMethod: string;
  status: JobRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Application {
  id: string;
  requestId: string;
  workerUid: string;
  message: string;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  fromUid: string;
  toUid: string;
  requestId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface JobRequestWithClient extends JobRequest {
  clientName: string;
  clientPhone?: string;
}

export interface WorkerProfileWithUser extends WorkerProfile {
  fullName: string;
  phone?: string;
  verificationStatus: VerificationStatus;
}

export interface ApplicationWithWorker extends Application {
  workerName: string;
  workerOficio: Oficio;
  workerZone: Zone;
  workerRating: number;
  workerPhone?: string;
}
