import React from "react";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";

export default function DesarrolladoresRegistro({
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
  } = useForm({ defaultValues: Item });

  React.useEffect(() => {
    if (Item) {
      setValue("Nombre", Item.Nombre);
      setValue("Pais", Item.Pais);
      setValue("FechaCreacion", Item.FechaCreacion);
    }
  }, [Item, setValue]);

  const onSubmit = async (data) => {
    data.Activo = false; // Establecer el valor de activo a false por defecto
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
                    value: 30,
                    message: "Nombre no puede tener más de 30 caracteres",
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
              <label className="col-form-label">País:</label>
            </div>
            <div className="col-sm-8 col-md-4">
              <input
                type="text"
                className="form-control"
                {...register("Pais", {
                  required: "Pais es requerido",
                  minLength: {
                    value: 5,
                    message: "Pais debe tener al menos 5 caracteres",
                  },
                  maxLength: {
                    value: 30,
                    message: "Pais no puede tener más de 30 caracteres",
                  },
                })}
              />
              {errors.Pais && (
                <div className="alert alert-danger">
                  {errors.Pais.message}
                </div>
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-sm-4 col-md-2">
              <label className="col-form-label">Fecha de Creación:</label>
            </div>
            <div className="col-sm-8 col-md-4">
              <input
                type="date"
                className="form-control"
                {...register("FechaCreacion", {
                  required: "La fecha de Creacion es requerida",
                  validate: {
                    isAfter: (value) =>
                      new Date(value) > new Date("1958-01-01") ||
                      "La fecha de creacion debe ser posterior al 1 de enero de 1958",
                    isBefore: (value) =>
                      new Date(value) < new Date() ||
                      "La fecha de creacion no puede ser una fecha futura",
                  },
                })}
              />
              {errors.FechaCreacion && (
                <div className="alert alert-danger">
                  {errors.FechaCreacion.message}
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

DesarrolladoresRegistro.propTypes = {
  AccionABMC: PropTypes.string.isRequired,
  Item: PropTypes.object,
  Grabar: PropTypes.func.isRequired,
  Volver: PropTypes.func.isRequired,
};