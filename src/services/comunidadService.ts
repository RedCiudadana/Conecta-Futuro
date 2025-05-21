import type { ComunidadFM, Comunidad, WithSlug } from '../types/community';

function slugFromPath(path: string): string {
  const file = path.split('/').pop() || '';
  const base = file.replace(/\.(md|json|ya?ml)$/, '');
  return base
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]/g, '');
}

class ComunidadContentService {
  private comunidadFiles = import.meta.glob<
    { attributes: Comunidad }
  >('/src/content/comunidad/*.md', { eager: true });

  private _comunidades?: WithSlug<Comunidad>[];

  async getComunidades() {
    if (!this._comunidades) {
      this._comunidades = Object.entries(this.comunidadFiles).map(
        ([path, mod]) => {
          const file = mod as any;
          return {
            ...(file.attributes ?? file.metadata ?? {}),
            body: file.markdown || '',
            slug: slugFromPath(path),
          };
        },
      );
    }
    return this._comunidades;
  }

  async getComunidadBySlug(slug: string) {
    const comunidades = await this.getComunidades();
    return comunidades.find(c => c.slug === slug) ?? null;
  }

  async getHighlightedComunidades() {
    const comunidades = await this.getComunidades();
    return comunidades.filter(c => c.highlight);
  }
}

export const comunidadContentService = new ComunidadContentService();
