/**
 * Página compartida — formulario de ingreso. La usan las rutas:
 *   /auth/simple/ingresar  → layout: auth-simple
 *   /auth/card/ingresar    → layout: auth-card
 *   /auth/split/ingresar   → layout: auth-split
 *   /ingresar              → layout: auth (split por compatibilidad)
 *
 * El layout aporta el chrome (marca / panel / fondo). Esta página sólo
 * devuelve el formulario.
 */
import { FormularioIngresar } from '../../../components/auth/auth-forms.js';

export default async () => FormularioIngresar();
