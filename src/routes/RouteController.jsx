import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

const RouteController = (props) => {
  const { component: Component, requiredPermissions, ...rest } = props;
  const [isTokenOk, setIsTokenOk] = useState(true);
  const [hasPermission, setHasPermission] = useState(true);

  const init = () => {
    const authData = localStorage.getItem("auth");
    if (authData) {
      const auth = JSON.parse(authData);
      setIsTokenOk(auth.isAuth === true);
      
      // Verificación de permisos
      if (requiredPermissions) {
        const userPermissions = auth.permissions || [];
        const hasRequiredPermissions = requiredPermissions.every(permission => 
          userPermissions.includes(permission)
        );
        setHasPermission(hasRequiredPermissions);
      }
    } else {
      setIsTokenOk(false);
    }
  };

  useEffect(init, []);

  // Redirige según la autenticación y permisos
  if (!isTokenOk) {
    return <Redirect to={'/login'} />;
  }
  
  if (!hasPermission) {
    return <Redirect to={'/acceso'} />; // Puedes crear una página de "No autorizado"
  }

  return <Component {...rest} />;
};

export default RouteController;
