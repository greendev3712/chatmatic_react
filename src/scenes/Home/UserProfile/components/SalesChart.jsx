import React from 'react';
import { Area } from '../../components/Charts';
import { Image } from 'semantic-ui-react'
import moneybag from 'assets/images/money-bag.png';

import '../style.scss';

const SalesChart = ({ chartData, totalSales }) => {
  return (
    <div className="sales-chart">
      <div className="total-sales">
        <Image src={moneybag} className="money-bag"/> ${totalSales}
        <div style={{ fontSize: '14px'}}>Total sales</div>
      </div>
      <Area data={chartData}/>
    </div>
  );
};

export default SalesChart;