export interface ComunidadFM {
  title: string;
  image: string;
  descripcion: string;
  date: string;
  highlight?: boolean;
}

export type WithSlug<T extends object> = T & { slug: string };
export type Comunidad = WithSlug<ComunidadFM> & { body: string };