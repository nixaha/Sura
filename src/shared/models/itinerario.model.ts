export class Itinerario {
  constructor(
    public nombre?: string,
    public descripcion?: string,
    public ponente?: string,
    public lugar?: string,
    public horaInicio?: string,
    public horaFin?: string
  ) {}
}
