import React, { Component } from 'react';

import { Row, Col, Grid, Radio } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

import Horse from './Horse';
import Odds from './Odds';

import { TICKET_COST, HOUSE_TAKE, NUM_BOARDS, NUM_HORSES } from './constants';

const getTicketsSoldPerHorse = (props, horseIndex) => {
  let total = 0;
  Object.keys(props).forEach((key) => {
    if (key.endsWith(`horse${horseIndex}`)) {
      total = total + props[key];
    }
  });
  // take off the 1's per board
  total = total - NUM_BOARDS;
  return total;
}

const getTotalTicketsSold = (props) => {
  let total = 0;
  for (let horseIndex = 1; horseIndex <= NUM_HORSES; horseIndex++) {
    total = total + getTicketsSoldPerHorse(props, horseIndex);
  }
  return total;
}

const getTotalPot = (ticketSold = 0) => {
  return ticketSold * TICKET_COST;
}

const getHouseTake = (totalPot) => {
  return Math.ceil(totalPot * HOUSE_TAKE);
}

const getAvailablePot = (totalPot = 0, houseTake = 0) => {
  return totalPot - houseTake;
}

export const getPayoutPerTicket = (availablePot, ticketsToPay) => {
  const payout = Math.floor(availablePot / ticketsToPay);
  if (!isFinite(payout) || payout < TICKET_COST) {
    return TICKET_COST; // always pay out at least the ticket cost
  }
  return payout;
}

const getRaceTake = (houseTake, potRemainder) => {
  return houseTake + potRemainder;
}

const getInitialState = () => {
  const obj = {
    selectedBoard: 1,
    winningHorse: undefined
  };
  for (let boardIndex = 1; boardIndex <= NUM_BOARDS; boardIndex++) {
    for (let horseIndex = 1; horseIndex <= NUM_HORSES; horseIndex++) {
      obj[`board${boardIndex}horse${horseIndex}`] = 1;
    }
  }
  return obj;
}

class App extends Component {

  state = getInitialState();

  _handleBoardChange = (e) => {
    this.setState({ selectedBoard: Number(e.target.value) });
  }

  _handleHorseInputChange = (e) => {
    const { name, value } = e.target;
    const numberifiedValue = Number(value);
    if (!value || (isFinite(numberifiedValue) && numberifiedValue >= 1)) {
      this.setState({
        [name]: numberifiedValue
      });
    }
  }

  _handleWinningHorseChange = (e) => {
    const { value } = e.target;
    this.setState({ winningHorse: Number(value) });
  }

  _saveRace = () => {
    const now = Date.now();
    window.localStorage.setItem(now, JSON.stringify(this.state))
    this.setState(getInitialState());
  }

  render() {
    const { selectedBoard, winningHorse } = this.state;
    // only do this for one iteration of the outer loop
    const boardSelectors = [];
    for (let j = 1; j <= NUM_BOARDS; j++) {
      boardSelectors.push((
        <Radio key={j} name="board" inline checked={j === selectedBoard} value={j} onChange={this._handleBoardChange}>Board {j}</Radio>
      ));
    }

    const ticketsSold = getTotalTicketsSold(this.state);
    const totalPot = getTotalPot(ticketsSold);
    const houseTake = getHouseTake(totalPot);
    const availablePot = getAvailablePot(totalPot, houseTake);

    const payoutPerHorse = {};
    for (let i = 1; i <= NUM_HORSES; i++) {
      payoutPerHorse[`horse${i}Payout`] = getPayoutPerTicket(availablePot, getTicketsSoldPerHorse(this.state, i));
    }

    const actualPayout = winningHorse ? (getTicketsSoldPerHorse(this.state, winningHorse) * payoutPerHorse[`horse${winningHorse}Payout`]): 0;
    const potRemainder = availablePot - actualPayout;
    const raceTake = getRaceTake(houseTake, potRemainder);

    const horses = [];
    for (let i = 1; i <= NUM_HORSES; i++) {
      const horseProps = {
        index: i,
        key: i,
        selectedBoard,
        onChange: this._handleHorseInputChange
      };
      horseProps.payout = payoutPerHorse[i];
      for (let j = 1; j <= NUM_BOARDS; j++) {
        horseProps[`board${j}`] = this.state[`board${j}horse${i}`];
      }
      horses.push((
        <Horse {...horseProps} />
      ));
    }

    return (
      <Grid fluid>
        <Row>
          <Col sm={9}>
            <div className="select-board">
              {boardSelectors}
  					</div>
            <div className="horses clearfix">
              {horses}
            </div>
            <Row>
              <Col sm={4}>
                <dl className="dl-horizontal">
                  <dt>Tickets Sold:</dt>
                  <dd>{ticketsSold}</dd>
                  <dt>Collected (${TICKET_COST} per):</dt>
                  <dd>${totalPot}</dd>
                  <dt>- House's {HOUSE_TAKE * 100}%:</dt>
                  <dd>${houseTake}</dd>
                  <dt>= Available Pot:</dt>
                  <dd>${availablePot}</dd>
                </dl>
              </Col>
              <Col sm={4}>
                <dl className="dl-horizontal">
                  <dt>Available Pot:</dt>
                  <dd>${availablePot}</dd>
                  <dt>- Actual Payout:</dt>
                  <dd>${actualPayout}</dd>
                  <dt>= Pot Remainder:</dt>
                  <dd>${potRemainder}</dd>
                </dl>
              </Col>
              <Col sm={4}>
                <dl className="dl-horizontal">
                  <dt>House's {HOUSE_TAKE * 100}%:</dt>
                  <dd>{houseTake}</dd>
                  <dt>+ Pot Remainder:</dt>
                  <dd>{potRemainder}</dd>
                  <dt>= Race Take:</dt>
                  <dd>${raceTake}</dd>
                </dl>
              </Col>
            </Row>
            <button type="submit" onClick={this._saveRace} className="btn btn-success btn-block btn-large">Save This Race!</button>
          </Col>
          <Col sm={3}>
            <Odds {...payoutPerHorse} winningHorse={winningHorse} onChange={this._handleWinningHorseChange} />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default App;
