export const getErrorMessage = (error) => {
  if (error.code === "auth/email-already-in-use")
    return "Потребителят съществува!";
  if (error.code === "auth/invalid-email") return "Невалиден e-mail адрес!";
  if (error.code === "auth/weak-password") return "Твърде кратка парола!";
  if (error.code === "auth/missing-password") return "Моля въведете парола!";
  if (error.code === "auth/wrong-password") return "Грешни данни за вход!";
  if (error.code === "auth/user-not-found") return "Грешни данни за вход!";
};

export const getErrorMessageForCar = (car) => {
  if (!car.make) return "Моля изберете всички полета за марка, модел и година!";
};
