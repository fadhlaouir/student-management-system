/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

// Packages
import React from 'react';
import { Link } from 'react-router-dom';

// UI Components
import { Result, Button } from 'antd';

/* -------------------------------------------------------------------------- */
/*                               Not Found Page                               */
/* -------------------------------------------------------------------------- */
function NotFoundPage() {
  /* -------------------------------- RENDERING ------------------------------- */
  return (
    <Result
      status="404"
      title="404"
      subTitle="Désolé, la page que vous avez visitée n'existe pas."
      extra={
        <Link to="/acceuil">
          <Button type="primary">Retour à la page d&apos;accueil</Button>
        </Link>
      }
    />
  );
}

export default NotFoundPage;
