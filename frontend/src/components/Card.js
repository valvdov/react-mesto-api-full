import React from 'react';
import CurrentUserContext from '../contexts/CurrentUserContext';

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  const currentUser = React.useContext(CurrentUserContext);
  const isOwn = card.owner === currentUser._id;
  const cardDeleteButtonClassName = (`button-delete ${isOwn ? 'button-delete_visible' : 'button-delete_hidden'}`);
  const isLiked = card.likes.some(i => i === currentUser._id);
  const cardLikeButtonClassName = `button-like ${isLiked ? 'button-like_active' : ''}`;

  function handleCardClick() {
    onCardClick(card);
  }
  function handleLikeClick() {
    onCardLike(card);
  }
  function handleDeleteClick() {
    onCardDelete(card);
  }

  return (
    <li className="elements__list-item">
      <img className="elements__image" alt={card.name} src={card.link} onClick={handleCardClick} />
      <button type="button" className={cardDeleteButtonClassName} aria-label="Удалить карточку" onClick={handleDeleteClick} ></button>
      <div className="elements__container">
        <h2 className="elements__text">{card.name}</h2>
        <div className="elements__like-container">
          <button type="button" className={cardLikeButtonClassName} aria-label="Поставить лайк" onClick={handleLikeClick}></button>
          <span className="elements__like-counter">{card.likes.length}</span>
        </div>
      </div>
    </li>
  )
}
export default Card;
