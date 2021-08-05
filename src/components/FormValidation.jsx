import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import page from "page";

const hasValidName = (str) => str.length > 0;
const hasValidAge = (age) => age >= 18;

const hasValidInputs = inputs => Object.values(inputs).every(x => x === true);

const validators = { name: hasValidName, age: hasValidAge };
const errors = {
  name: "Error: name field cannot be empty",
  age: "Error: you must be 18 or older.",
};

const Input = props => {
  const { children, id, message, status, type, onBlur, onChange } = props;
  const cls = "rounded-sm px-4 py-3 mt-3 focus:outline-none bg-gray-100 w-full";
  const error = <label for={id}>{message}</label>;

  const inputMessage = status === "error" ? error : null;

  return (
    <fieldset>
      <label for={id}>{children}</label>
      <input
        class={cls}
        id={id}
        type={type}
        onInput={onChange}
        onBlur={onBlur}
      ></input>
      <div aria-live="polite">{inputMessage}</div>
    </fieldset>
  );
};

const Demo = () => {
  const [formState, setFormState] = useState({ name: "", age: null });
  const [inputStatus, setInputStatus] = useState({ name: "none", age: "none" });
  const [errorMessages, setErrorMessages] = useState({ name: "", age: "" });

  const setErrorState = inputStatus => {
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

  const resetErrorState = id => {
    setInputStatus({ ...inputStatus, [id]: "none" });
    setErrorMessages({ ...errorMessages, [id]: "" });
  };

  const checkInputs = formState => {
    return Object.keys(formState).reduce((acc, next) => {
      const validate = validators[next];
      const currentState = formState[next];
      const isValid = validate(currentState);

      return isValid ? { ...acc, [next]: true } : { ...acc, [next]: false };
    }, {});
  };

  const handleSubmit = e => {
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

  return (
    <form>
      <Input
        id="name"
        type="text"
        message={errorMessages["name"]}
        status={inputStatus["name"]}
        value={formState.name}
        onChange={handleInput}
        onBlur={resetErrorState}
      >
        What is your name?
      </Input>

      <Input
        id="age"
        type="number"
        message={errorMessages["age"]}
        status={inputStatus["age"]}
        value={formState.age}
        onChange={handleInput}
        onBlur={resetErrorState}
      >
        What is your age?
      </Input>

      <button onClick={handleSubmit}>Click meh</button>
    </form>
  );
};


export default Demo;
