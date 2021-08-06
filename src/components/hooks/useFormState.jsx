import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import { errors, validators } from "../../util.js";

const initValues = {
  first: "",
  middle: "",
  last: "",
  age: "",
  email: "",
};

const initStatuses = {
  first: "none",
  middle: "none",
  last: "none",
  age: "none",
  email: "none",
};

const useFormState = () => {
  const [formState, setFormState] = useState(initValues);
  const [inputStatus, setInputStatus] = useState(initStatuses);
  const [errorMessages, setErrorMessages] = useState(initValues);

  const setErrorState = (inputStatus) => {
    const inputStates = Object.keys(inputStatus).reduce((acc, next) => {
      return inputStatus[next] === true
        ? { ...acc, [next]: "none" }
        : { ...acc, [next]: "error" };
    }, {});

    const errorMessages = Object.keys(inputStatus).reduce((acc, next) => {
      return inputStatus[next] === true
        ? { ...acc, [next]: "" }
        : { ...acc, [next]: errors[next] };
    }, {});

    setInputStatus(inputStates);
    setErrorMessages(errorMessages);
  };

  const resetErrorState = (id) => {
    setInputStatus({ ...inputStatus, [id]: "none" });
    setErrorMessages({ ...errorMessages, [id]: "" });
  };

  const checkInputs = (formState) => {
    return Object.keys(formState).reduce((acc, next) => {
      const validate = validators[next];
      const currentState = formState[next];
      const isValid = validate(currentState);

      return isValid ? { ...acc, [next]: true } : { ...acc, [next]: false };
    }, {});
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const inputStatus = checkInputs(formState);

    if (!hasValidInputs(inputStatus)) {
      return setErrorState(inputStatus);
    }

    return alert("Inputs are valid!");
  };

  const handleInput = (e) => {
    const { id, value } = e.target;
    const validate = validators[id];
    const hasError = inputStatus[id] === "error";
    const hasValidInput = validate(value);

    if (hasError && hasValidInput) {
      resetErrorState(id);
    }

    setFormState({ ...formState, [id]: value });
  };

  return {
    state: { formState, inputStatus, errorMessages },
    handlers: { handleSubmit, handleInput },
  };
};

export default useFormState