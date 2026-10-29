// Gera todos os links do WhatsApp do site, sempre com mensagem pronta.
import { site } from '../data/site';

export const MENSAGEM_PADRAO =
  'Olá! Gostaria de agendar uma visita ao Paraíso da Criança. Idade da criança: __. Período de interesse: __.';

export function whatsapp(mensagem: string = MENSAGEM_PADRAO): string {
  return `https://wa.me/${site.whatsappNumero}?text=${encodeURIComponent(mensagem)}`;
}

/** Variação usada nos blocos das casas. */
export function whatsappCasa(nomeCasa: string): string {
  return whatsapp(
    `Olá! Gostaria de agendar uma visita ao Paraíso da Criança. Tenho interesse na Casa ${nomeCasa}. Idade da criança: __. Período de interesse: __.`,
  );
}
