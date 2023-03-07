
const Input = ({inputState, type}) => {
    const [inp, setInp] = inputState
    return (
        <input value={inp} type={type}
         onChange={({ target }) => setInp(target.value)} />
    )
}

export default {Input}

