const Input = ({ inpState, type }) => {
    const [inp, setInp] = inpState
    return (<input value={inp} 
        onChange={({ target }) => setInp(target.value)} type={type} />
    )
}

export default { Input }
