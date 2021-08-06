import { h } from "preact";
import Input from "../utility/Input.jsx";

const Email = () => {
  return (
    <div class="animate__animated animate__fadeInRight animate__fast">
      <h2>Contact</h2>
      <form>
        <fieldset>
          <legend>What is your email?</legend>
          <div class="flex flex-row justify-start">
            <Input>Email address</Input>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default Email;
