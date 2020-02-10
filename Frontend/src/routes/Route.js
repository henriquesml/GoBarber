import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'

import AuthLayout from '~/pages/_layouts/auth'
import DefaultLayout from '~/pages/_layouts/default'

import { store } from '~/store'

export default function RouteWrapper({
  component: Component,
  isPrivate,
  isUndefined,
  ...rest
}) {
  const { signed } = store.getState().auth

  if (!signed && ( isPrivate || isUndefined )) {
    return <Redirect to="/" />
  }

  if (signed && !isPrivate) {
    return <Redirect to="/dashboard" />
  }

  const Layout = signed ? DefaultLayout : AuthLayout

  return (
    <Route
      {...rest}
        render={props => (
          <Layout>
            <Component {...props} />
          </Layout>
    )}/>
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
