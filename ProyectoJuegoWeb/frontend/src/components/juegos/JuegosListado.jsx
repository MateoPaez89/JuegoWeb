import React from "react";
import PropTypes from "prop-types";
import moment from "moment";

export default function JuegosListado({
  Items,
  Consultar,
  Modificar,
  ActivarDesactivar,
  Pagina,
  RegistrosTotal,
  Paginas,
  Buscar,
}) {
  return (
    <div className="table-responsive">
      <table className="table table-hover table-sm table-bordered table-striped">
        <thead>
          <tr>
            <th className="text-center">Nombre</th>
            <th className="text-center">Fecha de Lanzamiento</th>
            <th className="text-center">Precio</th>
            <th className="text-center">Desarrollador</th>
            <th className="text-center">Géneros</th>
            <th className="text-center">Plataformas</th>
            <th className="text-center">Activo</th>
            <th className="text-center text-nowrap">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Items && Items.length > 0 ? (
            Items.map((Item) => (
              <tr key={Item.IdJuego}>
                <td className="text-end">{Item.Nombre}</td>
                <td className="text-end">
                  {moment(Item.FechaLanzamiento).format("DD/MM/YYYY")}
                </td>
                <td className="text-end">{Item.Precio}</td>
                <td className="text-end">{Item.Desarrollador}</td>
                <td className="text-end">
                  {Array.isArray(Item.Generos) ? Item.Generos.join(', ') : Item.Generos}
                </td>
                <td className="text-end">
                  {Array.isArray(Item.Plataformas) ? Item.Plataformas.join(', ') : Item.Plataformas}
                </td>
                <td>{Item.Activo ? "SI" : "NO"}</td>
                <td className="text-center text-nowrap">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    title="Consultar"
                    onClick={() => Consultar(Item)}
                  >
                    <i className="fa fa-eye"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    title="Modificar"
                    onClick={() => Modificar(Item)}
                  >
                    <i className="fa fa-pencil"></i>
                  </button>
                  <button
                    className={
                      "btn btn-sm " +
                      (Item.Activo
                        ? "btn-outline-danger"
                        : "btn-outline-success")
                    }
                    title={Item.Activo ? "Desactivar" : "Activar"}
                    onClick={() => ActivarDesactivar(Item)}
                  >
                    <i
                      className={"fa fa-" + (Item.Activo ? "times" : "check")}
                    ></i>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                No se encontraron registros...
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Paginador */}
      <div className="paginador">
        <div className="row">
          <div className="col">
            <span className="pyBadge">Registros: {RegistrosTotal}</span>
          </div>
          <div className="col text-center">
            Página: &nbsp;
            <select
              value={Pagina}
              onChange={(e) => {
                Buscar(e.target.value);
              }}
            >
              {Paginas?.map((x) => (
                <option value={x} key={x}>
                  {x}
                </option>
              ))}
            </select>
            &nbsp; de {Paginas?.length}
          </div>
        </div>
      </div>
    </div>
  );
}

JuegosListado.propTypes = {
  Items: PropTypes.array.isRequired,
  Consultar: PropTypes.func.isRequired,
  Modificar: PropTypes.func.isRequired,
  ActivarDesactivar: PropTypes.func.isRequired,
  Pagina: PropTypes.number.isRequired,
  RegistrosTotal: PropTypes.number,
  Paginas: PropTypes.array.isRequired,
  Buscar: PropTypes.func.isRequired,
};