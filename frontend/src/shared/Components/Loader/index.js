/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

// Packages
import React from 'react';

// UI Component
import { Spin } from 'antd';

// Style
import './index.css';

/* -------------------------------------------------------------------------- */
/*                                   Loader                                   */
/* -------------------------------------------------------------------------- */
function Loader() {
  /* -------------------------------- RENDERING ------------------------------- */
  return (
    <div className="loader">
      <Spin size="large" className="loader-spin" />
    </div>
  );
}

export default Loader;
