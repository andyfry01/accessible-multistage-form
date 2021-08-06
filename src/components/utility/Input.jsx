import { h } from "preact";
// import { nanoid } from "nanoid";

const accessibility = "focus:ring focus:ring-4 focus:ring-pink-400 ring-offset-2";
const wrapper = "flex flex-col justify-start w-100 mr-4"
const layout = "px-3 py-3 w-full relative";
const appearance = "bg-white bg-white border-blue-500 rounded border";
const cls = `${accessibility} ${layout} ${appearance}`;

const label = "ml-1 pt-sans"

// const id = nanoid();

const Input = (props) => {
  const { children, id, message, status, type, onBlur, onChange } = props;

  const error = <label for={id}>{message}</label>;
  const inputMessage = status === "error" ? error : null;

  return (
    <div class={wrapper}>
      <label class={label} for={id}>{children}</label>
      <input
        class={cls}
        id={id}
        type={type}
        onInput={onChange}
        onBlur={onBlur}
      />
      <div aria-live="polite">{inputMessage}</div>
    </div>
  );
};

export default Input;
