import { h } from "preact";
import useRouter from './hooks/useRouter'
import useFormState from './hooks/useFormState'

const App = () => {
  const View = useRouter()
  const { state, handlers } = useFormState()
 
  return (
    <div class="container pt-20 mx-auto">
      <div class="w-1/2 mx-auto">

        <View {...state} {...handlers} />
        <a href="./email">Email?</a>
        <a href="./confirm">Confirm?</a>
        <a href="./name">Name??</a>
      </div>
    </div>
  );
};

export default App;
