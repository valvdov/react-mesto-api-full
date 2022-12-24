import React from 'react';
import truth from "../images/truth.svg"
import error from "../images/error.svg"

function InfoTooltip({ isOpen, onClose, successfulReg }) {
  return (
    <div className={`popup ${isOpen ? "popup_opened" : ""}`}>
    <div className="popup__container">
      <button id="success-close-button" type="button" className="popup__close-button" onClick={onClose}/>
      <img className="popup__signup-image" src={`${successfulReg ? truth : error}`} alt="" />
      <h2 className="popup__signup-title">{`${successfulReg ? "Вы успешно зарегистрировались!" : "Что-то пошло не так! Попробуйте ещё раз."}`}</h2>
    </div>
  </div>
  )
}

export default InfoTooltip;
