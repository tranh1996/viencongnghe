'use client';

import React from 'react';
import {HistoryMilestone} from '@/utils/api';
import '@/assets/css/timeline.css';

interface TimelineProps {
  items: HistoryMilestone[];
}

const Timeline: React.FC<TimelineProps> = ({ items }) => {
  return (
    <section className="overflow-hidden timeline-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 col-md-12">
            <div className="main-timeline position-relative">
              {items.map((item, index) => {
                const isEven = index % 2 === 0;
                const orderSuffix = isEven ? 'b' : '';
                
                return (
                  <div key={index} className="timeline_item">
                    <div className={`date-content timeline-order-1${orderSuffix}`}>
                      <div className="date">
                        {item.year}
                      </div>
                    </div>
                    <div className={`timeline-icon timeline-order-2${orderSuffix}`}>
                      <i className="flaticon flaticon-microscope"></i>
                    </div>
                    <div className={`timeline-content timeline-order-3${orderSuffix} col-md`}>
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;