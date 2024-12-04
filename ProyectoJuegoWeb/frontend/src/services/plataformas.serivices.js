import httpService from "./http.service";
import { config } from "../config";
const urlResource = config.urlResourcePlataformas;

async function Buscar(Nombre, Activo, Pagina) {
  const resp = await httpService.get(urlResource, {
    params: { Nombre, Activo, Pagina },
  });
  return resp.data;
}

async function BuscarPorId(item) {
  const resp = await httpService.get(urlResource + "/" + item.IdPlataforma);
  return resp.data;
}

async function ActivarDesactivar(item) {
  item.Activo = !item.Activo;
  await httpService.put(urlResource + "/" + item.IdPlataforma, item);
}

async function Grabar(item) {
  if (item.IdPlataforma === 0) {
    await httpService.post(urlResource, item);
  } else {
    await httpService.put(urlResource + "/" + item.IdPlataforma, item);
  }
}

const plataformasService = {
  Buscar,
  BuscarPorId,
  ActivarDesactivar,
  Grabar,
};

export default plataformasService;