import React from 'react';
import { Block } from '../../Home/Layout';
import { sequenceGraph2 } from 'assets/img';
import { Button } from 'semantic-ui-react';

import '../style.scss';

const TemplateCard = ({ item, index, buttonText, onButtonClick }) => {
  const handleButtonClick = () => {
    onButtonClick(item);
  };
  return (
    <Block className={`default item blue`}>
      <Block className="choose-sequence-inner">
        <Block className="icon-col">
          <img src={index === 0 ? sequenceGraph2 : item.pictureUrl || sequenceGraph2} size='full' className='graph' />
        </Block>
        <h3 className="sq-title">
          {item.name}
        </h3>
        <h4 className="sq-description">
          {item.description}
        </h4>
        <Block className="button-col">
          <Button className="ui primary button" onClick={handleButtonClick}>
            {buttonText}
          </Button>
        </Block>
      </Block>
    </Block>
  );
};

export default TemplateCard;