Table of contents: 

- Introduction
- Tech stack - problems
- Tech stack - solutions
- Animation
- Accessibility
- Local storage
- Validation
- Putting it all together


# Building Accessible Multistep Forms in React with Awesome UX

## Introduction

Multi-step forms are a common phenomenon on the web. And for good reason! They offer a lot of UX benefits: 

- A series of shorter forms can feel less overwhelming to your visitors than a long single-page form.
- By presenting a form as a series of steps, site visitors get a feeling of progression and a sense of how long the rest of the form will take to fill out.
- You can add functionality to save a visitor's progress for later, making it easier to fill out a long form in smaller sessions.
- They can lead to [higher conversions](https://www.ventureharbour.com/multi-step-lead-forms-get-300-conversions/), which is great for your bottom line.

However, multi-step forms have some technical challenges that need to be addressed to make it a pleasant and accessible experience for your visitors, especially if you're using a SPA framework like React,: 

- From a tech perspective, they are more complicated to build than a single-page form. A garden variety HTML form tracks its own state, but a multi-step form in an SPA requires some kind of JS-based state tracking. 
- From a UX perspective, they need special considerations to avoid confusing or alienating your visitors. A full page load is a commonly-understood signal to visitors that something is changing, but instantaneous "snapping" from one form step to another may happen too quickly for some visitors to notice.
- From an accessibility perspective, multi-step forms are frequently inaccessible. They are often implemented as a set of JavaScript-generated DOM nodes which are swapped in and out of a container element, and not as separate HTML pages. 

These challenges are all surmountable, and the benefits are frequently worth it. I'd like to take you through my thought process when implementing forms like these, both from a technical perspective, as well as the ethical and user experience (UX) perspectives as well. These forms shouldn't simply *work*, they should *work well*! 

So! Let's explore how to make an accessible multi-step form in React. There are a lot of topics to cover, and they're all broken down by chapter.  

Let's get all the benefits, minimize any technical snags, and make our UX as good as it can be.



## Your tech stack

### Problems

Before we even start building this form, the first thing we should assess is the tech stack we're building with. 

There are as many tech stacks out there as grains of sand on a beach, but this is a pretty typical modern stack: 

- React for rendering and state management
- React Router for client-side routing
- Bootstrap for CSS

JUST this – no actual application code, no images, no fonts, no nothing – comes out to almost 2 megabytes of code! We haven't even added any of our own code yet, this is the baseline. And our app doesn't even DO anything yet!

If you're fortunate to live and work in a wealthy part of the world, with a new-ish phone in your pocket and good internet access, this may not seem like such a big concern. An afternoon's journey through the web might consume tens or hundreds of megabytes of code and assets along the way, but you'd never know it on a 5G connection, to say nothing of a localhost dev environment.

But if we expand the commonly understood definition of "web accessibility" a little bit, the picture looks very different. "Accessible" outside the context of the web means "easy to access," and an unnecessarily bloated website is anything but. If your web app is a chonker of a page that takes a long time to download, then you're cutting off that easy access to those who don't have fast internet or a modern browsing device.

### Solutions

So, what can we do to cut down on baseline code? 

### React vs Preact

Instead of React, why not use [Preact](https://preactjs.com/)? It has the exact same API and clocks in at a fraction of the size. [There are differences](https://preactjs.com/guide/v10/differences-to-react) in how Preact works internally, but nothing that would impact most React projects. 

You may not even need to refactor your app to integrate Preact either: it can be used as a drop-in replacement for React via the [preact-compat](https://github.com/preactjs/preact-compat) library. 

### React Router vs Page.js

Instead of React Router, why not use something like [Page.js](https://github.com/visionmedia/page.js/), or if you're going with Preact, [preact-router](https://github.com/preactjs/preact-router). If we're talking about big, chonky libraries, React Router is the chonkiest. Most use cases don't justify such a huge library. 

React Router does include some important accessibility features along with its routing capabilities, but we can reimplement them ourselves easily enough with very little code. We'll address this in the accessibility section of the guide. 

If all you need is simple frontend URL routing, pick a simple URL router. 

### Monolith CSS vs Utility CSS

Instead of a monolithic CSS library like Bootstrap, how about something smaller? You've got a lot of options here: 

- [Milligram](https://milligram.io/), a lightweight framework which uses element selectors instead of class selectors for many of its styles. Think `<h1>A nice heading</h1>` instead of `<h1 class="heading">A nice heading</h1>`. This makes it super simple to use. 
- [Bonsai.css](https://www.bonsaicss.com/) and [Pure.css](https://purecss.io/). These use both element-based and class-based selectors, which gives you more custom styling options than Milligram.
- And of course, the ever-controversial [TailwindCSS](https://github.com/tailwindlabs/tailwindcss) (which this blog uses!). Tailwind is unique in that it has built-in utilities for removing unused styles from your final CSS file. Most builds come out to mere kilobytes in size: a tidy snack at any internet speed.

Now that we've got that out of the way, let's look at building the form itself. 

## Animations

Your typical visitor is accustomed to page loads. A fresh request for a new HTML page will clear the viewport of content, trigger a browser's loading indicators, and usually takes a moment or two to complete. These are unmistakable indicators that "something new" is occurring, and cue us to start looking out for those new somethings. 

When a SPA framework loads a new "page," this does not occur. Those hundreds or thousands of milliseconds of page loading may happen instantaneously, with none of the usual indicators that something has happened. A visitor could miss that transition, and if they do, they may start to feel confused, alienated, or frustrated. This is a bad user experience, and bad for your bottom line!

Animations can help us signal that there is new content on the page. On every "page-transition" in this very blog, I've been using the `fadeInUp` animation from [Animate.css](https://animate.style/). I like Animate.css because:

- The animations are general enough to use on many different elements.
- Like Tailwind, Animate.css has [utilities for removing unused styles](https://animate.style/#custom-builds), which cuts down on file size.
- As an accessibility bonus, the styles are all written to respect the [prefers-reduced-motion](https://animate.style/#accessibility) media query for visitors with vestibular disorders.

Be judicious in your use of animations, however. Check out the [best practices guidelines](https://animate.style/#Best_practices) in the docs for a great primer on when to use animations and when to skip them. 

## Accessibility

The [Animations](#Animations) section addresses the instantaneous SPA page-loading problem from a *visual* perspective. However, millions of web users are *visually impaired*, or otherwise need or want to use a [screen reader](https://en.wikipedia.org/wiki/Screen_reader) or other [assistive tools](https://www.w3.org/WAI/people-use-web/tools-techniques/) to browse the web.

### Missing signals

Your typical screen reader software is well aware of when a page load occurs. There are many clear, baked-in signals which broadcast this: a visitor has opened a new browser window or tab, has clicked a link, or has typed in a URL and hit enter. 

These unambiguous signals do not occur during changes in "dynamic" content – when JavaScript changes the content on the screen **without** a new HTML page being requested from a backend server. To a sighted visitor, it may look like the same thing: the content on the screen changes, and so you know you're on a new page, or at least in some kind of new context. Assistive technology, however, has a hard time realizing that anything has happened. 

There are several other side effects which occur when a new page is loaded in a browser too: 

- The document [`title`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title) changes: e.g., from "The New York Times" to "Guest Essay: Why Everything is Horrible and Getting Worse".
- The "focus" of the screenreader itself changes. Screenreader focus is like keyboard focus. If you don't know what keyboard focus is, here's a great [primer on how it works](https://www.youtube.com/watch?v=EFv9ubbZLKw).
- The scroll position resets to the top of the page.

### Demonstration

This can be confusing to think about without a visual demonstration, so let's check out some videos demonstrating accessibility problems and solutions.

One of the biggest problems with SPA frameworks is keyboard and/or screen reader focus. This is a video demonstrating how focus changes between "normal" page loads using MacOS Voiceover on Safari. Because we're loading brand new static pages from a backend server, everything behaves as it should. Notice how the black Voiceover focus ring moves between elements until I click on the "Dragon Ball Z" link, which loads a new page and moves Voiceover focus back to "web content"[`1].

VIDEO GO HERE

And here is an example of an inaccessible set of pages, where content and URL changes are 100% JavaScript driven. Notice how:

- The black Voiceover focus ring remains stuck in place after page changes. It's still visually located where the previous link was located even though the link has disappeared.
- The scroll position remains stuck at the previous scroll position (middle of the page, not the top). Even though the browser and/or the screen reader itself has helpfully moved focus to the top of the document, you wouldn't know it until you attempt to navigate around. When you do start to navigate, the page snaps jarringly upwards to where focus actually is.
- The title of the page hasn't changed, so there's no new announcement with a new page title when we click on links.

VIDEO GO HERE

### Adding the signals back in

So, in order to make a client-driven route change accessible, we need to: 

1. Scroll to the top of the new page.
2. Change the document's title so the screen reader will announce the new page.
3. Programmatically set focus to ... *something* on the new page.

Those first two pieces are fortunately pretty simple, but that last piece is trickier. As of writing, there is not one single "best practice" solution for *where* you should send focus on a route change, seeing as the default browser and screen reader behaviors can't be reproduced with JavaScript. Voiceover focuses on the outer "web content" box when the browser loads a new page, but this is outside the document, and JavaScript can't access it. 

Being thus limited to stuff within the document itself, some approaches are to:

- Focus on the document `body` tag
- Focus on the container node of the app (usually `<div id="target"></div>)
- Focus on the topmost part of the app tree that changed (the approach of [Reach Router](https://reach.tech/router/accessibility))
- Focus on the top level heading of the page (frequently an `h1` element)
- Focus on a [skip navigation link](https://webaim.org/techniques/skipnav/) at the top of the page

All of these strategies can be found somewhere on the internet, all have their various upsides and drawbacks. You should pick one though, because the alternative isn't pretty!

Here's a video which fixes our previously inaccessible Bob Ross website. It scrolls to the top, and changes the document title after every route change. It also demonstrates two page-load focus strategies: 

- Focus on the first heading
- Focus on a skip navigation link

VIDEO GO HERE

### The code

So, to enable accessible SPA route changes, we need three things: 

1. We need to scroll to the top of the page:
```js
window.scrollTo({x: 0})
```

2. We need to change the document title: 
```js
document.title = "Guest Essay: If We Just Work Together We Can Stop the Apocalypse Guys"
```

3. We need to set focus. My favorite strategy is to set focus on the first heading of the page. To make that easier to perform programmatically, let's add an id to the exact element we want to focus on:

```html
<h1 id="focus-target">Welcome to the home page</h1>
```

And after that, we programmatically focus on that element. Because of browser bugs and other inconsistent behavior, there are a few extra steps we need to do aside for just calling `focus` on our target element to ensure that this happens correctly across all browsers. The what and why of these extra steps are summarized very nicely in [this article](https://accessible-app.com/pattern/vue/routing).

```js
const setFocus = () => {
    setTimeout(() => {
        const focusTarget = document.getElementById("focus-target")
        focusTarget.setAttribute('tabindex', '-1');
        focusTarget.focus();
        focusTarget.removeAttribute('tabindex');
    }, 0);
}
```

#### Complete example

Here's the full code from the video example, simplified for ease of reading:

```jsx
import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import page from "page";

// Note the "focus-target"
const Home = () => {
    return (
        <div>
            <h1 id="focus-target">Welcome to the home page</h1>
            <a href="/page-1">Go to page one</a>
        </div>
    )
}

const Page1 = () => {
    return (
        <div>
            <h1 id="focus-target">You made it to page 1!</h1>
            <a href="/">The movie's over, go home</a>
        </div>
    )
}

const routes = {
    Home: Home,
    Page1: Page1,
};

const scrollTop = () => window.scrollTo({x: 0})
const changeTitle = title => document.title = title
const setFocus = () => {
    setTimeout(() => {
        const focusTarget = document.getElementById("focus-target")
        focusTarget.setAttribute('tabindex', '-1');
        focusTarget.focus();
        focusTarget.removeAttribute('tabindex');
    }, 0);
}

const onRoutechange = ({ title, view }) => {
    scrollTop()
    changeTitle(title)
    setView(view)
}

const App = () => {
    const [view, setView] = useState("Home");

    // route definition, these callbacks get called on each route change
    page("/", () => onRoutechange({title: "Home page", view: "Home"}))
    page("/page-1", () => onRoutechange({title: "Page one", view: "Page1"}))
    
    // init the router
    useEffect(() => page({ hashbang: true }), []);
  
    const View = routes[view];
  
    // render the actual page
    return <View />
}

ReactDOM.render(<App />, document.getElementById("root"))
```

### Further reading

Here is some further reading on the topic if you'd like to dive deeper:

- [A great summary of accessible routing issues for all SPA frameworks](https://accessible-app.com/pattern/vue/routing), and a Vue-specific implementation of accessible routing

- [A recent user testing research document](https://www.gatsbyjs.com/blog/2019-07-11-user-testing-accessible-client-routing/) conducted by the Gatsby team, with an in-depth summary of the problems and commentary by users of assistive technology on what they like and don't like about the various focus methods. 

[:^1] "Web content" is like a bounding box containing the website itself. When focus is on web content, you can "enter the web content," which is like diving into the document, and restricts voiceover navigation to the website itself. Without entering the web content, Voiceover navigates between controls in the application itself, which enables you to interact with the toolbar, back and forwards buttons, URL text field, etc.

## Persistent state

The internet is a complicated place. Your average FE dev has a plethora of things they have to worry about and take into consideration: OAuth, sessions, cookies, tokens, third-party scripts and SaaS vendors of all varieties and descriptions. If you work in a big corporation, your "website" may be comprised of many different apps overseen by many different teams, with different stacks, dependency versions, deadlines, goals, and political aims. 

All of these factors can impact a multi-step form, and many of them will draw visitors away from your app: either to a different app on your same domain or to a separate third-party domain entirely. The [happy path](https://en.wikipedia.org/wiki/Happy_path) of your form will hopefully see the visitor staying within the boundaries of your own app from start til finish, but the second that someone has to step out of the flow, things can get hairy. 

This is to say nothing of the form itself. If you've got a particularly long set of steps, many visitors will not have the patience or fortitude to complete them in a single sitting. Your average React app only persists its state for the duration of a window session. Once a visitor closes a window or refreshes, the state they've created will disappear. 

We need some way to save what the impatient or time-strapped visitor has filled out so they don't have to start over from scratch when they come back. 

Fortunately, we have many options here! And you don't even need a backend server to store your state either. If you do have one, I would probably recommend saving it in a proper database. This offers maximum flexibility and doesn't tie the data for your form to a specific computer or phone.  

But if you don't have easy access to a backend database, the browser itself offers many options for persisting state between window sessions:

- [Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies): the OG client side storage strategy for the web. Cookies have the best support across all browsers, but they are the least performant option, have a size limit of [just 4 KB](https://stackoverflow.com/questions/8706924/how-big-of-a-cookie-can-should-i-create#8706946) per cookie, and can only save strings. Unless you need to support very old browsers, I wouldn't recommend this approach.
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API), a fully-fledged client-side transactional database which works with JavaScript objects. This offers you a lot of API options for reading, writing, and updating data, but unless you have a particularly complicated app, it may be overkill. 
- [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), a happy medium between cookies and IndexedDB. It unfortunately only works with string values, which means extra work for transforming between types during writes and reads (what do you mean `1 + "1" = "11"`??), but it does offer a nice key/value API system, and is [well supported](https://caniuse.com/?search=localstorage) across many browsers. 

Let's use `localStorage` to save our form state!

### Strategy

We need two things to make a `localStorage` state persistence strategy work: 

1. A way to save form state
2. A way to "hydrate" our saved form state back into our app when it is reloaded, i.e: us a way to use that previous state as the initial state of the app

#### Saving form state

The `localStorage` API makes the act of saving our state easy enough: 

```js
// Our state object:
const [state, setState] = useState({name: "Andy", location: "USA"})

// A call to setItem 
// We stringify the object because localStorage only works with strings
localStorage.setItem("form-state", JSON.stringify(state))
```

The tricky part is *when* to do this. We've got a couple popular and sensible patterns to choose from: 

1. When transitioning to a new section of the form, or
2. When an [`onBlur`](https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event) event occurs on a form control

I like the `onBlur` strategy personally. When a visitor "leaves" a text input, it's usually because they're finished with that part of the form and are moving onto the next part. We can hook into this event to store our form state. Here's an event handler function for doing just that: 

```js
const handleBlur = () => {
  localStorage.setItem("form-state", JSON.stringify(state));
};
```

And a fully functional demo. Whenever a visitor exits the text input, what they've entered will be persisted in `localStorage`:

```jsx
import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Demo = () => {
  const [state, setState] = useState({ name: "Andy" })
  const handleInput = e => {
    const { id, value } = e.target;

    setState({ ...state, [id]: value });
  };

  const handleBlur = () => {
    localStorage.setItem("form-state", JSON.stringify(state));
  };
  
  return (
    <fieldset>
      <label for="ex">What's your name?</label>
      <input id="ex"
        type="text" 
        value={state.name}
        onChange={handleInput}
        onBlur={handleBlur}></input>
    </fieldset>
  )
}

ReactDOM.render(<Demo />, document.getElementById('root'))

```

We can't retrieve that state from `localStorage` yet however, let's figure out how!

#### Hydrating form state

A fresh app load is the point at which we should hydrate the app with that saved form state. In terms of the UX flow for this process, we've got some things to consider: 

1. Does this visitor even have a previous state we can use, or is this their first time here? 
2. Does the visitor *actually* want to use their previous state? Maybe they'd like to fill it out from scratch because the information has changed since they started, or maybe it's a shared device with multiple people who need to fill out the same form.
3. If they *don't* want to use their previous state, what do we do with it? 

Knowing this, we can make a list of checks and tasks to perform on initial app load:

1. Check for any existing form state on load.
2. If there **is** a saved state, we should prompt a visitor with the option to prefill the form with their old values first before filling it into the form.
3. If they want to use it, hydrate away! 
4. If not, get rid of it.
5. If there isn't any saved state, we load the app with an empty initial state.

So let's implement through those steps!

##### Check for form state on load

In a hook-based React app, a `useEffect` call with an empty dependency array is the thing to use (although [`useLayoutEffect`](https://reacttraining.com/blog/useEffect-is-not-the-new-componentDidMount/) may be a better option in some circumstances). We can read our form state from `localStorage` within the function call, and decide what to do from there: 

```js
useEffect(() => {
  const savedState = localStorage.getItem("form-state");

  if (savedState) {
    // do something
  }
}, []);
```

##### If there is saved state, prompt the user to prefill the form

Let's use the homely `window.confirm` function for this. It's drop-dead easy to implement, and 100% accessible out of the box!

```js
useEffect(() => {
  const savedState = localStorage.getItem("form-state");

  if (savedState) {
     const shouldPreFill = window.confirm("Looks like you've filled out part of this form already, would you like to keep what you've already entered?");
  }
}, []);
```

##### Hydrate the saved state if they want to prefill

A `JSON.parse` and a quick `setState` function call will do just that (remember, we're saving the state object as a JSON string): 

```js
useEffect(() => {
	const savedState = localStorage.getItem("form-state");
  
  if (savedState) {
  	const shouldPreFill = window.confirm("Looks like you've filled out part of this form already, would you like to keep what you've already entered?");
      
		if (shouldPreFill) {
      const stateObj = JSON.parse(savedState);
			setState(stateObj);
		}
	}
}, []);
```

##### Delete the saved state if they don't want to prefill

Just one more `if` check to add, along with a call to `localStorage.removeItem`: 

```js
useEffect(() => {
	const savedState = localStorage.getItem("form-state");
  
  if (savedState) {
  	const shouldPreFill = window.confirm("Looks like you've filled out part of this form already, would you like to keep what you've already entered?");
      
		if (shouldPreFill) {
      const stateObj = JSON.parse(savedState);
			setState(stateObj);
		}
		
		if (!shouldPreFill) {
			localStorage.removeItem("form-state");
		}
	}
}, []);
```

##### If there's no saved state, load with initial state

Surprise ... we've already done this! Because all of our functionality is wrapped up in that first `if (savedState)` check, none of the above will run if there isn't any saved state in `localStorage`. 

### Complete example

Here's everything we've seen so far wrapped up into a fully functional example: 

```jsx
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
  
    const handleInput = e => {
        const { id, value } = e.target;
    
        setFormState({ ...formState, [id]: value });
    };
  
    const handleBlur = () => {
        localStorage.setItem("form-state", JSON.stringify(formState));
    };
  
    return (
        <form>
            <fieldset>
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
```



## Validation

The last piece of a great multi-step form experience is *validation*, or the detection and communication of form errors before submission. Input validation is helpful for all parties involved: people make errors all the time, and website owners want nice, clean data in their databases. 

However, before we get into the "how"s of validation, let's take a step back and note that the "what"s of validation can be way more complicated than they first appear.

### Avoid overzealous input validation
I'd advise you to be as permissive as possible when it comes to validating input. Computers don't handle unexpected input very well, so there usually has to be *some* kind of validation performed before data enters your database. However, excessively restrictive validation can negatively impact your visitors. People with unique names (like "Jennifer Null") get flagged as invalid all the time, and [can be locked out of using some services entirely](https://www.bbc.com/future/article/20160325-the-names-that-break-computer-systems). Street address formats [vary drastically across the world](https://ux.shopify.com/designing-address-forms-for-everyone-everywhere-f481f6baf513), as do [phone numbers](https://en.wikipedia.org/wiki/National_conventions_for_writing_telephone_numbers). 

There are way too many edge cases out there to account for all of the unknown unknowns. You may think you've got them all figured out, but chances are that you haven't accounted for every single one. Chances are *very* good, in fact, that your cultural, regional, and language biases for what constitutes "correct" and "incorrect" input have been implicitly encoded into your validation code, and this has the potential to lock huge swathes of the world out of your website. 

In the best case scenario, you've simply annoyed someone by ensnaring them in a validation check which doesn't take their particular edge case into account. In the worst case scenario, you've disenfranchised a person for being unique, or perhaps simply for not being from your country. 

It's a big world full of unstandardized information out there, and it's always changing. Be as permissive with your validations as your ethical sensibilities, technological limitations, and business needs will permit.

### What to validate

So, now that we know that we should validate responsibly, we should define *what* to validate. Two broad categories are:

1. Wrong input, such as can be reliably determined
2. Missing input

Names and phone numbers are notoriously hard to validate in all their variety and complexity, but fortunately things like email addresses have a [well-defined spec](https://datatracker.ietf.org/doc/html/rfc5322#section-3.4.1) that we can rely on for validation purposes. "Age is just a number" is both a cliche and a logical truism: the numerical representation of the number of times you've been around the sun isn't debatable or format-dependent. Wrong input, in these limited instances, is relatively easy to detect and can be strictly validated. 

There are other dimensions to "correct" input as well. If a field needs to be unique, like a username or an email address, then you can reliably know whether one string matches another (although once upon a time, [this was not the case!](https://youtu.be/MijmeoH9LT4)).

Missing input is also fortunately an easy one to cover. An empty string in a required field is simple and foolproof to detect, as is an unchecked radio button or unselected dropdown item. 

### When to validate

Once you've identified what to validate, the question is *when* to communicate this to a visitor. You've got a few options:

1. When a visitor clicks "next" to move onto the next part of the form, or "submit" when they've finished
2. When a visitor has finished entering a value in a field and has moved on to the next (our friend `onBlur` from the "Persistent state" chapter)
3. Instantly, as a visitor enters in information. While the field is in an error state, you display the message. When the input is correct, you remove the error state.

The merits of these strategies are debatable and context-dependent. You can find research which claim that [visitors make more errors with inline onBlur validation](https://uxmovement.com/forms/why-users-make-more-errors-with-instant-inline-validation/), and you can find other research which [claim that onBlur validation leads to faster form completion and higher satisfaction](https://alistapart.com/article/inline-validation-in-web-forms). Many best practice guides will tell you not to validate as a visitor is actively typing, but in some limited contexts that instant feedback can be beneficial, like for password fields with rules on minimum length and types of characters.

There isn't a ton of hard evidence to lean on, most of the research has been performed on very small sample sizes, and much of the literature is opinion-based. 

However, there *is* one part of your flow where you *have* to validate no matter what, and that is on submit of the completed form. It's our last chance before we send the data off, smoke em if you got em. 

So to keep things simple, let's focus on validating on submit. Because this is all about multi-step forms, we'll extend that definition just a bit to mean after each completed step of the form too. 

### How to validate

There are a lot of moving pieces to this, so let's break them down one by one. 

#### Validation logic and error messages

Firstly, what are we validating? In this example, we'll verify that our "name" field is not empty, and that our "age" field is at least 18. Let's write some validator functions and error messages: 

```js
const hasValidName = str => str.length > 0
const hasValidAge = age => age >= 18

const errors = { name: "Error: name field cannot be empty", 
                 age: "Error: you must be 18 or older." }

const validators = { name: hasValidName, age: hasValidAge }
```

#### The Input component

Next, we need the inputs for the form itself. We've got multiple inputs this time, so let's whip up a quick reusable component. The whole shebang looks like this: 

```jsx
const Input = props => {
    const { children, id, message, status, type, onBlur, onChange } = props

    const error = <label for={id}>{message}</label>
    const inputMessage = status === "error" ? error : null

    return (
        <fieldset>
            <label for={id}>{children}</label>
            <input class={cls} id={id} type={type} onChange={onChange} onBlur={onBlur} />
            <div aria-live="polite">
                {inputMessage}
            </div>
        </fieldset>
    )
}
```

There are a few things of note here: 

- `aria-live="polite"`: this is an accessibility feature for our error states. Much like with accessible routing, we need to give the browser some hints when we dynamically update the error messages for our inputs. You can read more about live regions [here](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions).
- `label`s and `id`s. Properly labeled form elements are critical for accessibility. You not only need descriptive label content to inform a visitor what belongs in each form field, but the `label` elements themselves need to be tied to their respective `input`s with unique ids. This goes both for the form label itself and for the error label, if any.
- The `message` and `status` props. Many React components will use the presence or absence of a prop as the indicator of a component's state. We could just pass a `message` prop to the component, and use the presence or absence of a `message` to determine whether the component is in an error state or not, but what if we need more states in the future? Like "weak" or "strong" for password strength. By separating out the "fact" that the component is in a particular state from the message text of the state itself, we can avoid this kind of [duck typing](https://en.wikipedia.org/wiki/Duck_typing) and leave our future selves with more breathing room if and when we need to make changes to the component. 

#### The app state

Speaking of states, let's get those set up too: 

```js
const [formState, setFormState] = useState({ name: "", age: null })
const [inputStatus, setInputStatus] = useState({ name: "none", age: "none" })
const [errorMessages, setErrorMessages] = useState({ name: "", age: "" })
```

`formState` will hold our actual inputs, `inputStatus` will represent the state that the inputs are in (either `"none"` or `"error"` for now), and `errorMessages` will contain the error message text itself, where appropriate.

#### Interactivity

And now the fun part! Tying everything together. We can break the process of validation into the following parts: 
- Grabbing each input, running it through its respective validator, and marking it as valid or invalid
- Setting error states and messages depending on whether the inputs are valid or invalid
- Blocking submission of the form if it's invalid, or permitting submission if it's all good
- Resetting an input error state when a visitor returns to correct it

You could put this into one big, messy event handler, but breaking things into discrete parts and working on the basis of return values wherever possible will encourage a nice, functional architecture, with easily swappable and refactorable code. That way you can focus on the "calculations" within your code separately from the "actions". [More on that idea here](https://lispcast.com/what-is-an-action/).

This part of the guide will make frequent use of [Object.keys](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys), [Array.reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce), and [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax), which are awesome ES5 and ES6 language features. If you're unfamiliar with how these work, you should brush up on them first.

##### Checking inputs
We've got our form values tied into an object, so let's keep that structure when marking them as valid or invalid to grease the wheels of this machine. This function will take our form state and will return an object marking each input as either valid (`true`) or invalid (`false`).

```js
const checkInputs = formState => {
    return Object.keys(formState).reduce((acc, next) => {
        const validate = validators[next]
        const currentState = formState[next];
        const isValid = validate(currentState)
        
        return isValid ? {...acc, [next]: true} : {...acc, [next]: false}
    }, {})
};

// Calling with this state:
checkInputs({ name: "Baba O'Riley", age: 15 })

// Yields this return value:
{ name: true, age: false }

// The name is ok, but you're too young Baba! This ain't no teenage wasteland.
```

##### Setting error states

Based on the object returned from `checkInputs`, we can now go into our `inputStatus` and `errorMessages` objects and reassign the keys respectively. All of our objects conform to the same `{inputOne: value, inputTwo: value}` schema, which enables us to write nice, general code: 

```js
const setErrorState = inputStatus => {    
  const inputStatus = Object.keys(inputStatus).reduce((acc, next) => {
    return inputStatus[next] === true 
      ? {...acc, [next]: "none"} 
      : {...acc, [next] : "error"}
  }, {})

  const errorMessages = Object.keys(inputStatus).reduce((acc, next) => { 
    return inputStatus[next] === true 
      ? {...acc, [next]: ""} 
      : {...acc, [next]: errors[next]}
  }, {})

  setInputStatus(inputStatus);
  setErrorMessages(errorMessages);
};

// If we send this object to `setErrorState`: 
setErrorState({ name: true, age: false })
// It will set these states: 
inputStatus = { name: "none", age: "error" }
errorMessages = { name: "", age: "Error: you must be 18 or older."}
```

##### Blocking or permitting submission of the form

Now that we've gotten our functions written, we need to call them. If the form has errors, we can set them, and if not, we can submit the form! ... or in this case, just call an `alert`, but you get the point:

```js
const handleSubmit = e => {
  	// preventing default, because this is a JS-driven form
    e.preventDefault();

    const inputStatus = checkInputs(formState)

    if (!hasValidInputs(inputStatus)) {
        return setErrorState(inputStatus)
    }

    return alert("Inputs are valid!")
};
```

##### Resetting an input when a visitor returns to correct it

Finally, at the end of our flow: resetting the error message when the visitor has corrected their faulty input. The error message should persist until it is corrected, which means that we'll have to check for input validity in the `onChange` event listener of the input. Here's what that looks like:

```js
const resetErrorState = id => {
    setInputStatus({ ...inputStatus, [id]: "none" });
    setErrorMessages({ ...errorMessages, [id]: "" });
};

const handleInput = e => {
    const { id, value } = e.target;
    const validate = validators[id]
    const wasInError = inputStatus[id] === "error"
    const nowHasValidInput = validate(value)

    if (wasInError && nowHasValidInput) {
        resetErrorState(id)
    }

    setFormState({ ...formState, [id]: value });
};
```

### Complete example

Whew! That was a lot, and may have been a bit confusing out of context. Here is the complete working example of the above code:

```jsx
import React, { useState } from "react";
import ReactDOM from "react-dom";

const hasValidName = str => str.length > 0;
const hasValidAge = age => age >= 18;
const hasValidInputs = inputs => Object.values(inputs).every(x => x === true);

const validators = { name: hasValidName, age: hasValidAge };
const errors = {
  name: "Error: name field cannot be empty",
  age: "Error: you must be 18 or older.",
};

const Input = props => {
  const { children, id, message, status, type, onBlur, onChange } = props;

  const error = <label for={id}>{message}</label>;
  const inputMessage = status === "error" ? error : null;

  return (
    <fieldset>
      <label for={id}>{children}</label>
      <input
        id={id}
        type={type}
        onChange={onChange}
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

  const handleInput = e => {
    const { id, value } = e.target;
    const validate = validators[id];
    const wasInError = inputStatus[id] === "error"
    const nowHasValidInput = validate(value)

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

      <button onClick={handleSubmit}>Click to submit the form</button>
    </form>
  );
};

ReactDOM.render(<Demo />, document.getElementById("root"));
```
