import { h } from 'preact'

const Intro = () => {
    return (
        <>
            <h1 class="abril font-bold text-5xl mb-12 text-center">A Form For a Thing</h1>
            <div class="mb-12">
                <p class="pt-sans font-normal text-xl">We're excited you want to use our thing!</p> 
                <p class="pt-sans font-normal text-xl">First we'd like to ask you a few questions, and then you can use the thing.</p>
            </div>
            <p class="text-center">
                <a href="/name" class="text-blue-700 inline-flex items-center font-semibold tracking-wide text-3xl text-center">
                    <span class="hover:underline">
                        Let's get started
                    </span>
                    <span aria-hidden="true" class="text-xl ml-2">&#8594;</span>
                </a>
            </p>
        </>
    )
}

export default Intro