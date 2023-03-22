import { forwardRef, useImperativeHandle, useState, cloneElement } from 'react'
import PropTypes from 'prop-types'

const Togglable = forwardRef(({ children, header }, refs) => {

  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display : visible ? 'none' : '' }
  const showWhenVisible = { display : visible ? '' : 'none' }

  const toggleVisibility =() => {
    //console.log('toglgle visibility clled- prevous value', visible);
    setVisible(!visible)
  }

  useImperativeHandle(refs, () => {
    return (
      toggleVisibility
    )
  })

  const headerWithButton = cloneElement(header, { onToggle : toggleVisibility })
  const childrenWithButton = cloneElement(children, { onToggle : toggleVisibility })

console.log('visible value', visible);
  return (<div>    
    <div style={hideWhenVisible} className='togglableHeader'>
      {headerWithButton}
    </div>
    <div style={showWhenVisible} className='togglableContent'>
      {childrenWithButton}
    </div>    
  </div>)
})

Togglable.displayName ='Togglable'

Togglable.propTypes = {
  children: PropTypes.element.isRequired,
  header: PropTypes.element.isRequired
}

export default Togglable