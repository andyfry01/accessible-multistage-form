import { h } from "preact";
import { useEffect, useState } from 'preact/hooks'
import page from "page";

import Name from "./form/Name";
import Email from "./form/Email";
import Confirmation from "./form/Confirmation";
import Start from "./prose/Start";

const routes = {
  name: Name,
  email: Email,
  confirmation: Confirmation,
  start: Start
};

const App = () => {
  const [view, setView] = useState("start");

  // router config
  // page("/", () => setView("start"));
  // page("/name", () => setView("name"));
  // page("/email", () => setView("email"));
  // page("/confirm", () => setView("confirmation"));
  page("/", () => setView("Inaccessible"));
  page("/link1", () => setView("start"));
  page("/link2", () => setView("start"));

  // init router
  useEffect(() => page({ hashbang: true }), []);

  const View = routes[view];

  return (
    <div class="container mx-auto pt-20">
      <View />
      <a href="./email">Email?</a>
      <a href="./confirm">Confirm?</a>
      <a href="./name">Name??</a>

    </div>
  );
};

export default App;
