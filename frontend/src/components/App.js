import React, { useState, useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import PopupWithConfirm from './PopupWithConfitm';
import CurrentUserContext from '../contexts/CurrentUserContext';
//import {CardsContext} from "../contexts/CardContext";
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';
import api from "../utils/api";
import auth from '../utils/auth';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);

  const [deleteCard, setDeleteCard] = useState('');
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [successfulReg, setSuccessfulReg] = useState(false);

  const [selectedCard, setSelectedCard] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isAddPhoto, setIsAddPhoto] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      auth.getContent(token)
        .then(res => {
          if (res) {
            setLoggedIn(true)
            setEmail(res.email)
          }
          history.push('/')
        })
        .catch(err => {
          console.log(err);
        })
    }
  });

  useEffect(() => {
    if (loggedIn) {
      api.getUserProfile().then((profileInfo) => {
        setCurrentUser(profileInfo)
      })
        .catch((err) => {
          console.log(err);
        })

      api.getCards().then((cardsData) => {
        setCards(cardsData)
      })
        .catch((err) => {
          console.log(err);
        })
      }

  }, [loggedIn, isAddPhoto]);

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false)
    setIsAddPlacePopupOpen(false)
    setIsEditAvatarPopupOpen(false)
    setSelectedCard({})
    setIsInfoTooltipPopupOpen(false)
    setIsConfirmPopupOpen(false)
  }

  function handleUpdateUser(newUserInfo) {
    setIsLoading(true);
    api.setUserProfile(newUserInfo).then((data) => {
      setCurrentUser(data);
      closeAllPopups();
    })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleUpdateAvatar(newAvatar) {
    setIsLoading(true);
    api.setUserAvatar(newAvatar).then((data) => {
      setCurrentUser(data);
      closeAllPopups();
    })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i === currentUser._id);
    console.log(card.likes)
    api.changeLikes(card._id, !isLiked).then((newCard) => {
      setCards((state) => state.map((c) => c._id === card._id ? newCard : c))
    })
      .catch((err) => {
        console.log(err);
      })
  }

  const handleCardDeleteClick = (cardId) => {
    setIsConfirmPopupOpen(!isConfirmPopupOpen);
    setDeleteCard(cardId);
  };

  function handleCardDelete(card) {
    setIsLoading(true);
    api.deleteCard(card._id).then(() => {
      setCards((state) => state.filter((item) => item._id !== card._id))
      closeAllPopups()
    })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      })
  }

  function handleAddPlaceSubmit(data) {
    setIsLoading(true);
    setIsAddPhoto(true);
    api.postCard(data).then((newCard) => {
      setCards([newCard, ...cards])
      closeAllPopups();
    })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
        setIsAddPhoto(false);
      });
  }

  function handleRegister(email, password) {
    auth.register(email, password)
      .then(res => {
        if (res) {
          setSuccessfulReg(true);
          setIsInfoTooltipPopupOpen(true);
          history.push('./signin');
        }
      })
      .catch(err => {
        setSuccessfulReg(false);
        setIsInfoTooltipPopupOpen(true);
        console.log(err);
      })
  }

  function handleLogin(email, password) {
    auth.login(email, password)
      .then(res => {
        if (res) {
          setLoggedIn(true);
          localStorage.setItem('token', res.token);
          history.go('/');
          //history.push('./');
        }
      })
      .catch(err => {
        setSuccessfulReg(false);
        setIsInfoTooltipPopupOpen(true);
        console.log(err);
      })
  }

  const handleSignOut = () => {
    setLoggedIn(false);
    localStorage.removeItem('token');
    history.push('/signin');
  };


  return (
    <CurrentUserContext.Provider value={currentUser}>
     {/*<CardsContext.Provider value={cards}>*/}
      <div className="page">
        <div className="page__content">
          <Header
            onSignOut={handleSignOut}
            userEmail={email} />
          <Switch>
            <Route path="/signin">
              <Login onLogin={handleLogin} />
            </Route>

            <Route path="/signup">
              <Register onRegister={handleRegister} />
            </Route>

            <ProtectedRoute
              path="/"
              loggedIn={loggedIn}
              component={Main}
              onEditProfile={setIsEditProfilePopupOpen}
              onAddPlace={setIsAddPlacePopupOpen}
              onEditAvatar={setIsEditAvatarPopupOpen}
              onCardClick={setSelectedCard}
              cards={cards}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDeleteClick}
            />
          </Switch>

          <Footer />

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
            onLoading={isLoading} />

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
            onLoading={isLoading} />

          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
            onLoading={isLoading} />

          <ImagePopup
            card={selectedCard}
            onClose={closeAllPopups} />
          <InfoTooltip
            isOpen={isInfoTooltipPopupOpen}
            successfulReg={successfulReg} onClose={closeAllPopups} />
          <PopupWithConfirm
            isOpen={isConfirmPopupOpen}
            onClose={closeAllPopups}
            onSubmit={handleCardDelete}
            card={deleteCard}
            onLoading={isLoading} />
        </div>
      </div>
      {/*</CardsContext.Provider>*/}
    </CurrentUserContext.Provider>
  );
}

export default App;
