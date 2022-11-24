import React from 'react';
import { Icon } from 'semantic-ui-react';
import shoppingCart from 'assets/images/shopping-cart.svg';
import rating from 'assets/images/rating.svg';
import flowChartSvg from 'assets/images/flowchart.svg';

import '../style.scss';

const NumericalInfo = ({ templateInfo }) => {
  const templateCount = !!templateInfo.templates && templateInfo.templates.length;
  const templateSoldCount = !!templateInfo.templatesSold && templateInfo.templatesSold.length;

  return (
    <div className="info-cards">
      <div className="col">
        <div className="info-card">
          <img className="card-icon" src={flowChartSvg}/>
          <div className="card-info">
            <div className="category">Total</div>
            <div className="card-value">{templateCount}</div>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="info-card">
          <img className="card-icon" src={rating}/>
          <div className="card-info">
            <div className="category">Reviews</div>
            <div className="card-value">1500</div>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="info-card">
          <img className="card-icon" src={shoppingCart}/>
          <div className="card-info">
            <div className="category">Sold</div>
            <div className="card-value">{templateSoldCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NumericalInfo;