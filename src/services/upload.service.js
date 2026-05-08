import { CONFIG_APP } from '../config/app.config.js';
import { estadoAuth } from '../store/auth.store.js';

/** Subida con eventos de progreso — XHR sigue siendo la API más simple para eso. */
export const subir = (archivo, { url = '/uploads', campo = 'file', alProgresar } = {}) =>
  new Promise((resolver, rechazar) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${CONFIG_APP.api.urlBase}${url}`);
    const token = estadoAuth.token.peek();
    if (token) xhr.setRequestHeader(CONFIG_APP.auth.cabeceraToken, `${CONFIG_APP.auth.prefijoToken} ${token}`);

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && alProgresar) alProgresar(Math.round((e.loaded / e.total) * 100));
    });

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try { resolver(JSON.parse(xhr.responseText)); }
        catch { resolver(xhr.responseText); }
      } else rechazar({ status: xhr.status, message: xhr.statusText });
    };
    xhr.onerror = () => rechazar({ status: 0, message: 'Error de red' });

    const fd = new FormData();
    fd.append(campo, archivo);
    xhr.send(fd);
  });
