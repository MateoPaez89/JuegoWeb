import { useState, useEffect } from "react";
import PlataformasBuscar from "./PlataformasBuscar";
import PlataformasListado from "./PlataformaListado";
import PlataformasRegistro from "./PlataformaRegistro";
import plataformasService from "../../services/plataformas.serivices";
import modalDialogService from "../../services/modalDialog.service";

function Plataformas() {
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
  const [error, setError] = useState(null);

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
      const data = await plataformasService.Buscar(Nombre, Activo, _pagina);
      setItems(data.Items);
      setRegistrosTotal(data.RegistrosTotal);

      const arrPaginas = [];
      for (let i = 1; i <= Math.ceil(data.RegistrosTotal / 10); i++) {
        arrPaginas.push(i);
      }
      setPaginas(arrPaginas);
    } catch (error) {
      setError(error.message);
      modalDialogService.Alert(error.message);
    } finally {
      modalDialogService.BloquearPantalla(false);
    }
  }

  async function BuscarPorId(item, accionABMC) {
    try {
      const data = await plataformasService.BuscarPorId(item);
      setItem(data);
      setAccionABMC(accionABMC);
    } catch (error) {
      setError(error.message);
      modalDialogService.Alert(error.message);
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
      IdPlataforma: 0,
      Nombre: "",
      FechaLanzamiento: "",
      Activo: true,
    });
  }

  function Imprimir() {
    modalDialogService.Alert("En desarrollo...");
  }

  async function ActivarDesactivar(item) {
    try {
      await plataformasService.ActivarDesactivar(item);
      await Buscar();
      modalDialogService.Alert(
        `Registro ${item.Activo ? "activado" : "desactivado"} correctamente.`
      );
    } catch (error) {
      setError(error.message);
      modalDialogService.Alert(error.message);
    }
  }

  async function Grabar(item) {
    try {
      await plataformasService.Grabar(item);
      await Buscar();
      Volver();
      modalDialogService.Alert(
        "Registro " +
          (AccionABMC === "A" ? "agregado" : "modificado") +
          " correctamente."
      );
    } catch (error) {
      setError(error.message);
      modalDialogService.Alert(
        error?.response?.data?.message ?? error.toString()
      );
    }
  }

  function Volver() {
    setAccionABMC("L");
  }

  return (
    <div>
      <div className="tituloPagina">
        Plataformas <small>{TituloAccionABMC[AccionABMC]}</small>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {AccionABMC === "L" && (
        <PlataformasBuscar
          Nombre={Nombre}
          setNombre={setNombre}
          Activo={Activo}
          setActivo={setActivo}
          Buscar={Buscar}
          Agregar={Agregar}
        />
      )}

      {AccionABMC === "L" && Items?.length > 0 && (
        <PlataformasListado
          {...{
            Items,
            Consultar,
            Modificar,
            ActivarDesactivar,
            Imprimir,
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
        <PlataformasRegistro
          {...{ AccionABMC, Item, Grabar, Volver }}
        />
      )}
    </div>
  );
}

export default Plataformas;