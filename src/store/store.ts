


// import { createSlice, configureStore } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";
// import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
// import { persistReducer, persistStore } from "redux-persist";

// interface SubjectScores {
//   [subject: string]: {
//     currentScore: number;
//     predictedScore: number;
//   };
// }

// interface SubjectState {
//   selectedSubject: string | null;
//   subjects: SubjectScores;
// }

// const initialState: SubjectState = {
//   selectedSubject: null,
//   subjects: {},
// };

// const subjectSlice = createSlice({
//   name: "subject",
//   initialState,
//   reducers: {
//     setSubject: (state, action: PayloadAction<string | null>) => {
//       state.selectedSubject = action.payload;
//     },
//     setSubjectScore: (
//       state,
//       action: PayloadAction<{ subject: string; currentScore: number; predictedScore: number }>
//     ) => {
//       const { subject, currentScore, predictedScore } = action.payload;
//       state.subjects[subject] = { currentScore, predictedScore };
//     },
//   },
// });

// export const { setSubject, setSubjectScore } = subjectSlice.actions;

// // 🔹 Persist config
// const persistConfig = {
//   key: "subject", // storage key
//   storage,
// };

// const persistedReducer = persistReducer(persistConfig, subjectSlice.reducer);

// export const store = configureStore({
//   reducer: {
//     subject: persistedReducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false, // required for redux-persist
//     }),
// });

// export const persistor = persistStore(store);

// // ✅ Add types for hooks
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;


import { createSlice, configureStore,  combineReducers } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; 
import { persistReducer, persistStore } from "redux-persist";

// =======================
// 🎯 Subject Slice
// =======================
interface SubjectScores {
  [subject: string]: {
    currentScore: number;
    predictedScore: number;
  };
}

interface SubjectState {
  selectedSubject: string | null;
  subjects: SubjectScores;
}

const initialSubjectState: SubjectState = {
  selectedSubject: null,
  subjects: {},
};

const subjectSlice = createSlice({
  name: "subject",
  initialState: initialSubjectState,
  reducers: {
    setSubject: (state, action: PayloadAction<string | null>) => {
      state.selectedSubject = action.payload;
    },
    setSubjectScore: (
      state,
      action: PayloadAction<{ subject: string; currentScore: number; predictedScore: number }>
    ) => {
      const { subject, currentScore, predictedScore } = action.payload;
      state.subjects[subject] = { currentScore, predictedScore };
    },
  },
});

// =======================
// 🎯 User Slice
// =======================
interface UserState {
  name: string;
  grade: string;
}

const initialUserState: UserState = {
  name: "",
  grade: "",
};

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.name = action.payload.name;
      state.grade = action.payload.grade;
    },
    clearUser: (state) => {
      state.name = "";
      state.grade = "";
    },
  },
});

// =======================
// 🎯 Combine Reducers
// =======================
const rootReducer = combineReducers({
  subject: subjectSlice.reducer,
  user: userSlice.reducer,
});

// 🔹 Persist config
const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// =======================
// 🎯 Store
// =======================
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

// =======================
// 🎯 Actions & Types
// =======================
export const { setSubject, setSubjectScore } = subjectSlice.actions;
export const { setUser, clearUser } = userSlice.actions;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
