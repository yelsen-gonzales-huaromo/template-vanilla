/**
 * Página compartida — pantalla "Revisa tu correo" tras registrarse o pedir
 * un cambio de email. Permite mostrar el correo destino vía ?email=.
 */
import { PantallaConfirmar } from '../../../components/auth/auth-screens.js';

export default async (ctx) => PantallaConfirmar({ correo: ctx?.query?.email });
