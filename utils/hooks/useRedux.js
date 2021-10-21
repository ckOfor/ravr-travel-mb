import React from "react";
import { useDispatch, useSelector } from "react-redux";

function useStore(module) {
  const dispatch = useDispatch();
  const selectStore = (value) => useSelector((state) => state[module][value]);

  return [dispatch, selectStore];
}

export default useStore;
