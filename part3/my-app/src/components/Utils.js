
const Input = ({inputState, type,id}) => {
    const [inp, setInp] = inputState
    return (
        <input id={id} value={inp} type={type}
         onChange={({ target }) => setInp(target.value)} />
    )
}

export default {Input}

