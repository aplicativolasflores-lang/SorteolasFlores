export const RESTAURANT = {
  name: 'La Parrilla del Chef',
  address: 'Av. Larco 1234, Miraflores, Lima',
  lat: -12.1191,
  lng: -77.0282,
  radiusMeters: 150,
  phone: '+51 1 234-5678',
  logo: '🍖',
};

export type Participant = {
  id: string;
  nombres: string;
  apellidos: string;
  dni: string;
  telefono: string;
  correo: string;
  fecha: string;
  hora: string;
  sorteoId: string;
  estado: 'activo' | 'ganador' | 'descalificado';
};

export type RegisteredParticipant = {
  id: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  ciudad: string;
  participacion_fecha: string;
  created_at: string;
  sorteo_id: string;
  estado: 'activo' | 'ganador' | 'descalificado';
};

export type Premio = {
  id: string;
  nombre: string;
  descripcion: string;
  valor: number;
  imagen: string;
  sorteoId: string;
  ganadorId?: string;
};

export type Sorteo = {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: string;
  fechaInicio: string;
  fechaFin: string;
  estado: 'activo' | 'pendiente' | 'finalizado';
  participantes: number;
  premios: number;
};

export type Ganador = {
  id: string;
  participanteId: string;
  premioId: string;
  sorteoId: string;
  nombres: string;
  apellidos: string;
  dni: string;
  premio: string;
  fecha: string;
  notificado: boolean;
};

export const SORTEOS: Sorteo[] = [
  {
    id: 's1',
    nombre: 'Gran Sorteo de Aniversario',
    descripcion: 'Celebramos 10 años con premios increíbles para nuestros clientes.',
    tipo: 'Experiencia gastronómica',
    fechaInicio: '2026-09-01',
    fechaFin: '2026-09-30',
    estado: 'activo',
    participantes: 142,
    premios: 3,
  },
  {
    id: 's2',
    nombre: 'Sorteo Fiestas Patrias',
    descripcion: 'Sorteo especial del mes de julio.',
    tipo: 'Experiencia gastronómica',
    fechaInicio: '2026-07-15',
    fechaFin: '2026-07-31',
    estado: 'finalizado',
    participantes: 98,
    premios: 2,
  },
  {
    id: 's3',
    nombre: 'Sorteo Navideño',
    descripcion: 'El gran sorteo de fin de año con los mejores premios.',
    tipo: 'Premios y productos',
    fechaInicio: '2026-12-01',
    fechaFin: '2026-12-24',
    estado: 'pendiente',
    participantes: 0,
    premios: 5,
  },
];

export const PARTICIPANTES: Participant[] = [
  { id: 'p1', nombres: 'Carlos Alberto', apellidos: 'Mendoza Ríos', dni: '45678901', telefono: '987654321', correo: 'carlos.mendoza@gmail.com', fecha: '2026-09-24', hora: '13:22', sorteoId: 's1', estado: 'activo' },
  { id: 'p2', nombres: 'María Elena', apellidos: 'Torres Vega', dni: '32145678', telefono: '976543210', correo: 'maria.torres@hotmail.com', fecha: '2026-09-24', hora: '13:45', sorteoId: 's1', estado: 'activo' },
  { id: 'p3', nombres: 'Luis Fernando', apellidos: 'Castillo Huamán', dni: '56789012', telefono: '965432109', correo: 'lcastillo@yahoo.com', fecha: '2026-09-23', hora: '12:10', sorteoId: 's1', estado: 'activo' },
  { id: 'p4', nombres: 'Ana Sofía', apellidos: 'Paredes Lozano', dni: '67890123', telefono: '954321098', correo: 'ana.paredes@gmail.com', fecha: '2026-09-23', hora: '14:30', sorteoId: 's1', estado: 'activo' },
  { id: 'p5', nombres: 'Jorge Manuel', apellidos: 'Flores Díaz', dni: '78901234', telefono: '943210987', correo: 'jflores@empresa.pe', fecha: '2026-09-22', hora: '19:05', sorteoId: 's1', estado: 'activo' },
  { id: 'p6', nombres: 'Carla Beatriz', apellidos: 'Ramírez Soto', dni: '89012345', telefono: '932109876', correo: 'carla.ramirez@gmail.com', fecha: '2026-09-22', hora: '20:15', sorteoId: 's1', estado: 'activo' },
  { id: 'p7', nombres: 'Roberto Jesús', apellidos: 'Guzmán Pineda', dni: '90123456', telefono: '921098765', correo: 'rguzman@outlook.com', fecha: '2026-09-21', hora: '13:00', sorteoId: 's1', estado: 'activo' },
  { id: 'p8', nombres: 'Valentina', apellidos: 'Morales Quispe', dni: '01234567', telefono: '910987654', correo: 'vale.morales@gmail.com', fecha: '2026-09-21', hora: '21:30', sorteoId: 's1', estado: 'activo' },
  { id: 'p9', nombres: 'Diego Alonso', apellidos: 'Chávez Mamani', dni: '12345678', telefono: '909876543', correo: 'dchavez@gmail.com', fecha: '2026-07-28', hora: '14:00', sorteoId: 's2', estado: 'ganador' },
  { id: 'p10', nombres: 'Lucía Fernanda', apellidos: 'Vargas Cruz', dni: '23456789', telefono: '898765432', correo: 'lucia.vargas@gmail.com', fecha: '2026-07-29', hora: '13:30', sorteoId: 's2', estado: 'activo' },
];

export const PREMIOS: Premio[] = [
  { id: 'pr1', nombre: 'Cena para 2 personas', descripcion: 'Cena completa para dos con bebidas incluidas', valor: 180, imagen: 'Premio', sorteoId: 's1' },
  { id: 'pr2', nombre: 'Parrillada familiar', descripcion: 'Parrillada completa para 4 personas', valor: 320, imagen: 'Premio', sorteoId: 's1' },
  { id: 'pr3', nombre: 'Vale de S/100', descripcion: 'Vale de consumo para usar en cualquier visita', valor: 100, imagen: 'Premio', sorteoId: 's1' },
  { id: 'pr4', nombre: 'Almuerzo ejecutivo x5', descripcion: '5 almuerzos ejecutivos para disfrutar', valor: 200, imagen: 'Premio', sorteoId: 's2', ganadorId: 'p9' },
  { id: 'pr5', nombre: 'Botella de vino premium', descripcion: 'Botella de vino tinto reserva de bodega', valor: 150, imagen: 'Premio', sorteoId: 's2' },
];

export const GANADORES: Ganador[] = [
  { id: 'g1', participanteId: 'p9', premioId: 'pr4', sorteoId: 's2', nombres: 'Diego Alonso', apellidos: 'Chávez Mamani', dni: '12345678', premio: 'Almuerzo ejecutivo x5', fecha: '2026-07-31', notificado: true },
];

export function calcDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export function hasParticipatedToday(identifier: string): boolean {
  const key = `raffle_${getTodayKey()}_${identifier}`;
  return localStorage.getItem(key) === 'true';
}

export function markParticipatedToday(identifier: string): void {
  const key = `raffle_${getTodayKey()}_${identifier}`;
  localStorage.setItem(key, 'true');
}

const LOCAL_PARTICIPANTS_KEY = 'raffle_local_participants';

export function getLocalParticipants(): RegisteredParticipant[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_PARTICIPANTS_KEY) ?? '[]') as RegisteredParticipant[];
  } catch {
    return [];
  }
}

export function saveLocalParticipant(participant: Omit<RegisteredParticipant, 'id'>): void {
  const saved = getLocalParticipants();
  saved.unshift({ ...participant, id: crypto.randomUUID() });
  localStorage.setItem(LOCAL_PARTICIPANTS_KEY, JSON.stringify(saved));
}
