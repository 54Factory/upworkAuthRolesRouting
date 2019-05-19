import React from 'react';
//import { Link } from 'react-router-dom';
import { siteConfig } from '../../settings';

export default ({ collapsed }) => {
  return (
    <div className="isoLogoWrapper">
      {collapsed ? (
        <div>
          <h3>
            <i className={siteConfig.siteIcon} />
          </h3>
        </div>
      ) : (
        <h3>
          {siteConfig.siteName}
        </h3>
      )}
    </div>
  );
};
