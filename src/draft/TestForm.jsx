

import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

const App = () => {
    const [formState, setFormState] = useState({ name: "" });
  
    useEffect(() => {
        const savedState = localStorage.getItem("form-state");
  
        if (savedState) {
            const shouldPreFill = window.confirm(
                "Looks like you've filled out part of this form already, would you like to keep what you've already entered?"
            );
    
            if (shouldPreFill) {
                const stateObj = JSON.parse(savedState);
                setFormState(stateObj);
            }
    
            if (!shouldPreFill) {
                localStorage.removeItem("form-state");
            }
        }
        }, []);
  
    const handleInput = (e) => {
        const { id, value } = e.target;
    
        setFormState({ ...formState, [id]: value });
    };
  
    const handleBlur = () => {
        localStorage.setItem("form-state", JSON.stringify(formState));
    };
  
    return (
        <form>
            <fieldse>
                <label for="name">What's your name?</label>
                <input type="text" 
                id="name" 
                value={formState.name} 
                onBlur={handleBlur} 
                onChange={handleInput} />
            </fieldset>
        </form>
    );
};

ReactDOM.render(<Demo />, document.getElementById("root"))
  