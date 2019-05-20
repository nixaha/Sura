// export class Evento {
//   constructor(
//     public id?: string,
//     public nombre?: string,
//     public descripcion?: string,
//     public clave?: string,
//     public imagen?: string
//   ) {}
// }

export interface Evento {
  id: string;
  nombre: string;
  descripcion: string;
  clave: string;
  imagen: string;
}
