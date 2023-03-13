const Input = ({ inpState, type }) => {
    const [inp, setInp] = inpState
    return (<input value={inp} 
        onChange={({ target }) => setInp(target.value)} type={type} />
    )
}

const Notification = ({info, className}) => {
    if(info===null)
    {
        return null
    }
    return (<div className={className}>{info}</div>)
}


export default { Input, Notification }
