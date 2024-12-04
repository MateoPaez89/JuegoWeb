import { useState, useEffect } from "react";
import DesarrolladoresBuscar from "./DesarrolladoresBuscar";
import DesarrolladoresListado from "./DesarrolladoresListado";
import DesarrolladoresRegistro from "./DesarrolladoresRegistro";
import desarrolladoresService from "../../services/desarrolladores.services";
import modalDialogService from "../../services/modalDialog.service";

function Desarrolladores() {
  const TituloAccionABMC = {
    A: "(Agregar)",
    B: "(Eliminar)",
    M: "(Modificar)",
    C: "(Consultar)",
    L: "(Listado)",
  };
  const [AccionABMC, setAccionABMC] = useState("L");

  const [Nombre, setNombre] = useState("");
  const [Activo, setActivo] = useState(true);

  const [Items, setItems] = useState([]);
  const [Item, setItem] = useState(null); // usado en BuscarporId (Modificar, Consultar)
  const [RegistrosTotal, setRegistrosTotal] = useState(0);
  const [Pagina, setPagina] = useState(1);
  const [Paginas, setPaginas] = useState([]);
  const [error, setError] = useState(null)


  useEffect(() => {
    if (error) {
        const timer = setTimeout(() => {
            setError(null);
        }, 5000); // El mensaje de error desaparecerá después de 5 segundos

        return () => clearTimeout(timer);
    }
}, [error]);

  useEffect(() => {
    async function BuscarDatos() {
      await Buscar();
    }
    BuscarDatos();
  }, []);

  async function Buscar(_pagina) {
    if (_pagina && _pagina !== Pagina) {
      setPagina(Number(_pagina)); // Convertir a número
    } else {
      _pagina = Pagina;
    }
    modalDialogService.BloquearPantalla(true);
    try {
      const data = await desarrolladoresService.Buscar(Nombre, Activo, _pagina);
      setItems(data.Items);
      setRegistrosTotal(data.RegistrosTotal);

      const arrPaginas = [];
      for (let i = 1; i <= Math.ceil(data.RegistrosTotal / 10); i++) {
        arrPaginas.push(i);
      }
      setPaginas(arrPaginas);
    } catch (error) {
      setError(error.message)
      modalDialogService.Alert(
        error.message
      );
    } finally {
      modalDialogService.BloquearPantalla(false);
    }
  }

  async function BuscarPorId(item, accionABMC) {
    try {
      const data = await desarrolladoresService.BuscarPorId(item);
      setItem(data);
      setAccionABMC(accionABMC);
    } catch (error) {
      setError(error.message)
      modalDialogService.Alert(
        error.message
      );
    }
  }

  function Consultar(item) {
    BuscarPorId(item, "C");
  }

  function Modificar(item) {
    if (!item.Activo) {
      modalDialogService.Alert("No puede modificarse un registro Inactivo.");
      return;
    }
    BuscarPorId(item, "M");
  }

  async function Agregar() {
    setAccionABMC("A");
    setItem({
      IdDesarrollador: 0,
      Nombre: "",
      Pais: "",
      FechaCreacion: "",
      Activo: true,
    });
  }

  async function ActivarDesactivar(item) {
    try {
      item.Activo = !item.Activo;
      await desarrolladoresService.Grabar(item);
      await Buscar();
    } catch (error) {
      modalDialogService.Alert(
        error.message
      );
    }
  }

  async function Grabar(item) {
    setError(null);
    try {
      await desarrolladoresService.Grabar(item);
      await Buscar();
      Volver();
      modalDialogService.Alert(
        "Registro " +
          (AccionABMC === "A" ? "agregado" : "modificado") +
          " correctamente."
      );
    } catch (error) {
      setError(error.message)
      modalDialogService.Alert(
        error.message
      );
    }
  }

  function Volver() {
    setAccionABMC("L");
  }

  return (
    <div>
      <div className="tituloPagina">
        Desarrolladores <small>{TituloAccionABMC[AccionABMC]}</small>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {AccionABMC === "L" && (
        <DesarrolladoresBuscar
          Nombre={Nombre}
          setNombre={setNombre}
          Activo={Activo}
          setActivo={setActivo}
          Buscar={Buscar}
          Agregar={Agregar}
        />
      )}

      {AccionABMC === "L" && Items?.length > 0 && (
        <DesarrolladoresListado
          {...{
            Items,
            Consultar,
            Modificar,
            ActivarDesactivar,
            Pagina,
            RegistrosTotal,
            Paginas,
            Buscar,
          }}
        />
      )}

      {AccionABMC === "L" && Items?.length === 0 && (
        <div className="alert alert-info mensajesAlert">
          <i className="fa fa-exclamation-sign"></i>
          No se encontraron registros...
        </div>
      )}

      {AccionABMC !== "L" && (
        <DesarrolladoresRegistro
          {...{ AccionABMC, Item, Grabar, Volver }}
        />
      )}
    </div>
  );
}

export default Desarrolladores;