import { configureStore } from "@reduxjs/toolkit";
import api from "./middlewares/api";
import reducer from "./reducer";

// export default function () {
//   return configureStore({
//     reducer,
//     middleware: [...getDefaultMiddleware(), api],
//   });
// }

export const store = configureStore({
  reducer: reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api),
});