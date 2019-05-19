import React from 'react';
import PropTypes from 'prop-types';
import PaperStyle from './paper.style';

const Paper = ({ title, right, children }) => (
  <PaperStyle title={title}>
    <div className="paper-title">
      <h3>{title}</h3>
      <div className="paper-title-right">
        {right}
      </div>
    </div>
    <div className="paper-content">
      {children}
    </div>
  </PaperStyle>
);

Paper.propTypes = {
  title: PropTypes.string
};

Paper.defaultProps = {
  title: null,
  right: null

};


export default Paper;
