import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import desarrolladoresService from "../../services/desarrolladores.services";
import generosService from "../../services/generos.services";
import plataformasService from "../../services/plataformas.serivices";

export default function JuegosRegistro({
  AccionABMC,
  Item,
  Grabar,
  Volver,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    getValues,
  } = useForm({ defaultValues: Item });

  const [desarrolladores, setDesarrolladores] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [plataformas, setPlataformas] = useState([]);
  const [selectedGeneros, setSelectedGeneros] = useState([]);
  const [selectedPlataformas, setSelectedPlataformas] = useState([]);

  useEffect(() => {
    async function cargarDatos() {
      const desarrolladoresData = await desarrolladoresService.Buscar("", true, 1);
      setDesarrolladores(desarrolladoresData.Items);

      const generosData = await generosService.Buscar("", true, 1);
      setGeneros(generosData.Items);

      const plataformasData = await plataformasService.Buscar("", true, 1);
      setPlataformas(plataformasData.Items);
    }
    cargarDatos();
  }, []);

  useEffect(() => {
    if (Item) {
      setValue("Nombre", Item.Nombre);
      setValue("FechaLanzamiento", Item.FechaLanzamiento);
      setValue("Precio", Item.Precio);
      setValue("IdDesarrollador", Item.IdDesarrollador);
      
       // Mapeo de nombres de generos a sus respectivos Ids
       const generosSeleccionados = generos.filter(genero =>
        Item.Generos.includes(genero.Nombre)
      ).map(genero => genero.IdGenero);
      setSelectedGeneros(generosSeleccionados);

      // Mapeo de nombres de plataformas a sus respectivos Ids
      const plataformasSeleccionadas = plataformas.filter(plataforma =>
        Item.Plataformas.includes(plataforma.Nombre)
      ).map(plataforma => plataforma.IdPlataforma);
      setSelectedPlataformas(plataformasSeleccionadas);

    }
    
  }, [Item, setValue, desarrolladores, generos, plataformas]);


  const onSubmit = async (data) => {
    data.Activo = Item?.Activo ?? false; // Mantener el valor de activo o establecerlo en false por defecto
    data.IdGeneros = getValues("Generos").map(Number); // Convertir los valores de géneros a números
    data.IdPlataformas = getValues("Plataformas").map(Number); // Convertir los valores de plataformas a números
    try {
      await Grabar(data);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        const messages = error.response.data.message.split("\n");
        messages.forEach((message) => {
          const [field, errorMessage] = message.split(": ");
          setError(field, { type: "manual", message: errorMessage });
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="container-fluid">
        <fieldset disabled={AccionABMC === "C"}>
          <div className="row">
            <div className="col-sm-4 col-md-2">
              <label className="col-form-label">Nombre:</label>
            </div>
            <div className="col-sm-8 col-md-4">
              <input
                type="text"
                className="form-control"
                {...register("Nombre", {
                  required: "Nombre es requerido",
                  minLength: {
                    value: 5,
                    message: "Nombre debe tener al menos 5 caracteres",
                  },
                  maxLength: {
                    value: 60,
                    message: "Nombre no puede tener más de 60 caracteres",
                  },
                })}
              />
              {errors.Nombre && (
                <div className="alert alert-danger">
                  {errors.Nombre.message}
                </div>
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-sm-4 col-md-2">
              <label className="col-form-label">Fecha de Lanzamiento:</label>
            </div>
            <div className="col-sm-8 col-md-4">
              <input
                type="date"
                className="form-control"
                {...register("FechaLanzamiento", {
                  required: "La fecha de lanzamiento es requerida",
                  validate: {
                    isAfter: (value) =>
                      new Date(value) > new Date("1958-01-01") ||
                      "La fecha de lanzamiento debe ser posterior al 1 de enero de 1958",
                    isBefore: (value) =>
                      new Date(value) < new Date() ||
                      "La fecha de lanzamiento no puede ser una fecha futura",
                  },
                })}
              />
              {errors.FechaLanzamiento && (
                <div className="alert alert-danger">
                  {errors.FechaLanzamiento.message}
                </div>
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-sm-4 col-md-2">
              <label className="col-form-label">Precio:</label>
            </div>
            <div className="col-sm-8 col-md-4">
              <input
                type="number"
                className="form-control"
                {...register("Precio", {
                  required: "El precio es requerido",
                  min: {
                    value: 0,
                    message: "El precio no puede ser negativo",
                  },
                })}
              />
              {errors.Precio && (
                <div className="alert alert-danger">
                  {errors.Precio.message}
                </div>
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-sm-4 col-md-2">
              <label className="col-form-label">Desarrollador:</label>
            </div>
            <div className="col-sm-8 col-md-4">
              <select
                className="form-control"
                {...register("IdDesarrollador", { required: "El desarrollador es requerido" })}
              >
                <option value="">Seleccione un desarrollador</option>
                {desarrolladores.map((desarrollador) => (
                  <option key={desarrollador.IdDesarrollador} value={desarrollador.IdDesarrollador}>
                    {desarrollador.Nombre}
                  </option>
                ))}
              </select>
              {errors.IdDesarrollador && (
                <div className="alert alert-danger">
                  {errors.IdDesarrollador.message}
                </div>
              )}
            </div>
          </div>

           {/* Generos */}    
           <div className="row">
          <div className="col-sm-4 col-md-2">
            <label className="col-form-label">Géneros:</label>
          </div>
          <div className="col-sm-8 col-md-4">
            {generos.map((genero) => (
              <div key={genero.IdGenero} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={genero.IdGenero}
                  {...register("Generos")}
                  checked={selectedGeneros.includes(genero.IdGenero)}
                  onChange={(e) => {
                    const newGeneros = e.target.checked
                      ? [...selectedGeneros, genero.IdGenero]
                      : selectedGeneros.filter(id => id !== genero.IdGenero);
                    setSelectedGeneros(newGeneros);
                    setValue("Generos", newGeneros);
                  }}
                />
                <label className="form-check-label">
                  {genero.Nombre}
                </label>
              </div>
            ))}
            {errors.Generos && (
              <div className="alert alert-danger">
                {errors.Generos.message}
              </div>
            )}
          </div>
        </div>

            

          {/* Plataformas */}
         <div className="row">
          <div className="col-sm-4 col-md-2">
            <label className="col-form-label">Plataformas:</label>
          </div>
          <div className="col-sm-8 col-md-4">
            {plataformas.map((plataforma) => (
              <div key={plataforma.IdPlataforma} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={plataforma.IdPlataforma}
                  {...register("Plataformas")}
                  checked={selectedPlataformas.includes(plataforma.IdPlataforma)}
                  onChange={(e) => {
                    const newPlataformas = e.target.checked
                      ? [...selectedPlataformas, plataforma.IdPlataforma]
                      : selectedPlataformas.filter(id => id !== plataforma.IdPlataforma);
                    setSelectedPlataformas(newPlataformas);
                    setValue("Plataformas", newPlataformas);
                  }}
                />
                <label className="form-check-label">
                  {plataforma.Nombre}
                </label>
              </div>
            ))}
            {errors.Plataformas && (
              <div className="alert alert-danger">
                {errors.Plataformas.message}
              </div>
            )}
          </div>
        </div>

        </fieldset>

        <hr />

        {/* Botones */}
        <div className="row">
          <div className="col-sm-12 col-md-6">
            {AccionABMC !== "C" && (
              <button
                type="submit"
                className="btn btn-primary"
              >
                Grabar
              </button>
            )}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={Volver}
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

JuegosRegistro.propTypes = {
  AccionABMC: PropTypes.string.isRequired,
  Item: PropTypes.object,
  Grabar: PropTypes.func.isRequired,
  Volver: PropTypes.func.isRequired,
};