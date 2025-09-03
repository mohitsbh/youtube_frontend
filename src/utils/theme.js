// src/utils/theme.js
export const isSouthIndianState = (state) => {
  const southStates = [
    "Tamil Nadu",
    "Kerala",
    "Karnataka",
    "Andhra Pradesh",
    "Telangana",
  ];
  return southStates.includes(state);
};

export const getCurrentTheme = (state) => {
  const hour = new Date().getHours();
  if (hour >= 10 && hour <= 12 && isSouthIndianState(state)) {
    return "light";
  }
  return "dark";
};
