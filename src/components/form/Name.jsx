import { h } from "preact";
import Input from "../utility/Input";

const Name = () => {
  return (
    <div class="animate__animated animate__fadeInRight animate__fast">
      <h2>About you</h2>
      <form>
        <fieldset>
          <legend>What is your name?</legend>
          <div class="flex flex-row justify-start">
            <Input>First</Input>
            <Input>Middle (optional)</Input>
            <Input>Last</Input>
          </div>
        </fieldset>

        <fieldset>
          <legend>What is your age?</legend>
          <div class="flex flex-row justify-start">
            <Input>Age</Input>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default Name;
