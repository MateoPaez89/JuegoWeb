import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

let ModalDialog_Show = null;

const Alert = (
  _mensaje,
  _titulo = "Atención",
  _boton1 = "Aceptar",
  _boton2 = "",
  _accionBoton1 = null,
  _accionBoton2 = null,
  _tipo = 'info'
) => {
  if (ModalDialog_Show)
    ModalDialog_Show(
      _mensaje,
      _titulo,
      _boton1,
      _boton2,
      _accionBoton1,
      _accionBoton2,
      _tipo
    );
};

const Confirm = (
  _mensaje,
  _titulo = "Confirmar",
  _boton1 = "Aceptar",
  _boton2 = "Cancelar",
  _accionBoton1 = null,
  _accionBoton2 = null,
  _tipo = 'info'
) => {
  if (ModalDialog_Show)
    ModalDialog_Show(
      _mensaje,
      _titulo,
      _boton1,
      _boton2,
      _accionBoton1,
      _accionBoton2,
      _tipo
    );
};

const BloquearPantalla = (bloquear) => {
  if (ModalDialog_Show) {
    ModalDialog_Show(
      bloquear ? "BloquearPantalla" : "",
      "",
      "",
      "",
      null,
      null,
      "info"
    );
  }
};

const subscribeShow = (callback) => {
  ModalDialog_Show = callback;
};

const modalService = {
  Alert,
  Confirm,
  BloquearPantalla,
  subscribeShow
};

export default modalService;

export function ModalDialog() {
  const [visible, setVisible] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [titulo, setTitulo] = useState("");
  const [boton1, setBoton1] = useState("");
  const [boton2, setBoton2] = useState("");
  const [accionBoton1, setAccionBoton1] = useState(null);
  const [accionBoton2, setAccionBoton2] = useState(null);
  const [tipo, setTipo] = useState("info");

  useEffect(() => {
    subscribeShow(
      (
        _mensaje,
        _titulo,
        _boton1,
        _boton2,
        _accionBoton1,
        _accionBoton2,
        _tipo
      ) => {
        setMensaje(_mensaje);
        setTitulo(_titulo);
        setBoton1(_boton1);
        setBoton2(_boton2);
        setAccionBoton1(() => _accionBoton1);
        setAccionBoton2(() => _accionBoton2);
        setTipo(_tipo);
        setVisible(true);
      }
    );
  }, []);

  const handleClose = () => {
    setVisible(false);
  };

  const handleBoton1 = () => {
    if (accionBoton1) accionBoton1();
    handleClose();
  };

  const handleBoton2 = () => {
    if (accionBoton2) accionBoton2();
    handleClose();
  };

  if (!visible) return null;

  return (
    <div className="modal-dialog">
      <div className={`modal-content modal-${tipo}`}>
        <div className="modal-header">
          <h5 className="modal-title">{titulo}</h5>
          <button type="button" className="close" onClick={handleClose}>
            <span>&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <p>{mensaje}</p>
        </div>
        <div className="modal-footer">
          {boton1 && (
            <button type="button" className="btn btn-primary" onClick={handleBoton1}>
              {boton1}
            </button>
          )}
          {boton2 && (
            <button type="button" className="btn btn-secondary" onClick={handleBoton2}>
              {boton2}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

ModalDialog.propTypes = {
  mensaje: PropTypes.string,
  titulo: PropTypes.string,
  boton1: PropTypes.string,
  boton2: PropTypes.string,
  accionBoton1: PropTypes.func,
  accionBoton2: PropTypes.func,
  tipo: PropTypes.string,
};