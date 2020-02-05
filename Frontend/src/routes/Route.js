import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'

export default function RouteWrapper({
  component: Component,
  isPrivate,
  isUndefined,
  ...rest
}) {
  const signed = false

  if (!signed && ( isPrivate || isUndefined )) {
    return <Redirect to="/" />
  }

  if (signed && !isPrivate) {
    return <Redirect to="/dashboard" />
  }

  return (
    <Route {...rest} component={Component}/>
  )
}

RouteWrapper.propTypes = {
  isPrivate: PropTypes.bool,
  isUndefined: PropTypes.bool,
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired
}

RouteWrapper.defaultProps = {
  isPrivate: false,
  isUndefined: false
}
