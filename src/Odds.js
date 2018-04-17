import React from 'react';

import { Radio } from 'react-bootstrap';

import { NUM_HORSES, TICKET_COST } from './constants';

const Odds = (props) => {
  const { winningHorse, onChange } = props;
  const lines = [];
  for (let i = 1; i <= NUM_HORSES; i++) {
    lines.push((
      <div key={i} className="horse-line clearfix">
        <Radio inline onChange={onChange} checked={winningHorse === i} value={i}>Horse {i}</Radio>
        <div className="pull-right">
          <strong>{props[`horse${i}Payout`]}</strong>
          <span className="text-muted"> / {TICKET_COST}</span>
        </div>
      </div>
    ));
  }

  return (
    <div className="odds">
      <h4>Odds (rounded down)</h4>
      {lines}
    </div>
  );
};

export default Odds;
