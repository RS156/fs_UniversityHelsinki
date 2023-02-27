

const LabelInput = ({ label, val, setVal }) => {
    const handleOnChange = (setFn) => (event) => {
      setFn(event.target.value)
    }
    return (
      <div>{label}: <input value={val} onChange={handleOnChange(setVal)} /> </div>
    )
  }
  
  

  export default LabelInput