import httpService from "./http.service";
import { config } from "../config";
const urlResource = config.urlResourceJuegos;

async function Buscar(Nombre, Activo, Pagina) {
  const resp = await httpService.get(urlResource, {
    params: { Nombre, Activo, Pagina },
  });
  return resp.data;
}

async function BuscarPorId(item) {
  const resp = await httpService.get(urlResource + "/" + item.IdJuego);
  return resp.data;
}

async function ActivarDesactivar(item) {
  item.Activo = !item.Activo;
  await httpService.put(urlResource + "/" + item.IdJuego, item);
}

async function Grabar(item) {
  if (item.IdJuego === 0) {
    await httpService.post(urlResource, item);
  } else {
    await httpService.put(urlResource + "/" + item.IdJuego, item);
  }
}

const juegosService = {
  Buscar,
  BuscarPorId,
  ActivarDesactivar,
  Grabar,
};

export default juegosService;