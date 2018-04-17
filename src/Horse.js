import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Form, FormControl } from 'react-bootstrap';

import { NUM_BOARDS } from './constants';

const getHorseTotal = (props) => {
  let horseTotal = 0;
  for (let i = 1; i <= NUM_BOARDS; i++) {
    horseTotal = horseTotal + props[`board${i}`];
  }
  horseTotal = horseTotal - NUM_BOARDS; // since they all start at 1
  return horseTotal;
}

class Horse extends PureComponent {

  static propTypes = {
    index: PropTypes.number,
    selectedBoard: PropTypes.number,
    onChange: PropTypes.func,
    // `board${boardIndex}`: PropTypes.number
  }

  render() {
    const { index, selectedBoard, onChange } = this.props;
    const numberInputs = [];
    for (let i = 1; i <= NUM_BOARDS; i++) {
      const value = this.props[`board${i}`];
      numberInputs.push((
        <FormControl
          bsSize="small"
          key={i}
          disabled={i !== selectedBoard}
          pattern="[0-9]*"
          name={`board${i}horse${index}`}
          className="input-mini horse-input"
          onChange={onChange}
          type="text"
          value={String(value)}
          maxLength="2" />
      ));
    }
    return (
      <div className="horse">
        <div className="horse-label">
          {index}
        </div>
        <Form inline className="horse-inputs">
          {numberInputs}
        </Form>
        <div className="horses-sold">
          {getHorseTotal(this.props)} total
        </div>
      </div>
    );
  }

}

export default Horse;
