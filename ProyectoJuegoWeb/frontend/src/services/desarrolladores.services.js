import httpService from "./http.service";
import { config } from "../config";
const urlResource = config.urlResourceDesarrolladores;

async function Buscar(Nombre, Activo, Pagina) {
  const resp = await httpService.get(urlResource, {
    params: { Nombre, Activo, Pagina },
  });
  return resp.data;
}

async function BuscarPorId(item) {
  const resp = await httpService.get(urlResource + "/" + item.IdDesarrollador);
  return resp.data;
}

async function ActivarDesactivar(item) {
  try {
    await httpService.put(urlResource + "/" + item.IdDesarrollador, item);
  } catch (error) {
    handleServiceError(error);
  }
}

async function Grabar(item) {
  try {
    if (item.IdDesarrollador === 0) {
      await httpService.post(urlResource, item);
    } else {
      await httpService.put(urlResource + "/" + item.IdDesarrollador, item);
    }
  } catch (error) {
    handleServiceError(error);
  }
}

function handleServiceError(error) {
  if (error.response && error.response.status === 401) {
    throw new Error("Debe loguearse para acceder a esta funcionalidad");
  } else {
    throw error;
  }
}

const desarrolladoresService = {
  Buscar,
  BuscarPorId,
  ActivarDesactivar,
  Grabar,
};

export default desarrolladoresService;