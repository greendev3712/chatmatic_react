import React, { useState } from 'react';
import { Pagination } from '../../Layout';

import '../style.css';

const ListTemplates = ({ templates }) => {
  const [ pageTemplates, setPageTemplates ] = useState([]);
  console.log(templates);

  const handlePageChange = (pageTemplates) => {
    setPageTemplates(pageTemplates);
  }

  return (
    <div className="template-container">
      <div className="template-list">
      {!!pageTemplates ? pageTemplates.map((template, index) => {
        return (
          <div className="template-card" key={index}>
            <div className="icon-col">
              {!!template.pictureUrl ? <img className='graph' src={template.pictureUrl}/> : null}
            </div>
            <div className="template-title">{template.name}</div>
          </div>
        );
      }) : null}
      </div>
      <div className="pagination">
      {!!templates && templates.length > 0 ? 
        <Pagination
          pageLimit={2}
          onPageChange={handlePageChange}
          data={templates}/>
      : null }
      </div>
    </div>
  );
};

export default ListTemplates;