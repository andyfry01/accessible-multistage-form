import { h } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import page from "page";

import Intro from "../form/Intro";
import Name from "../form/Name";
import Email from "../form/Email";
import Confirmation from "../form/Confirmation";

const routes = {
    root: Intro,
    name: Name,
    email: Email,
    confirm: Confirmation,
};
  
const useRouter = () => {
    const [view, setView] = useState("root");

    // router config
    page("/", () => setView("root"));
    page("/name", () => setView("name"));
    page("/email", () => setView("email"));
    page("/confirm", () => setView("confirm"));
   
    // init router
    useEffect(() => {
      page({ hashbang: true });
    }, []);
   
    const View = routes[view];

    return View
}

export default useRouter
