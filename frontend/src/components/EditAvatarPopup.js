import { useEffect } from 'react';
import PopupWithForm from './PopupWithForm';
import useForm from '../hooks/useForm';

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar, onLoading }) {
  const { enteredValues, errors, handleChange, isFormValid, resetForm } = useForm();

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateAvatar({
      avatar: enteredValues.avatar
    });
  }

  useEffect(() => {
    resetForm()
  }, [isOpen, resetForm]);

  return (
    <PopupWithForm
      name="avatarPopup"
      title="Обновить аватар"
      buttonText={onLoading ? `Сохранение` : `Сохранить`}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      onLoading={onLoading}
      isDisabled={!isFormValid}>
      <label className="form__field form__field-first">
        <input
          name="avatar"
          className={errors.avatar ? 'form__input form__input_type_error' : "form__input"}
          id="avatar-input"
          type="url"
          placeholder="Ссылка на картинку"
          required
          value={enteredValues.avatar || ''}
          onChange={handleChange} />
        <span className="form__input-error avatar-input-error">{errors.avatar}</span>
      </label>
    </PopupWithForm>
  )
}

export default EditAvatarPopup;
