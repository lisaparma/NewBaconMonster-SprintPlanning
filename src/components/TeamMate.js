import React from 'react';
import PropTypes from 'prop-types';
import AwIcon from 'awicons-react';
import { connect } from 'react-redux';
import {
  deleteMateAction,
  setDaysAction,
  setEfficiencyAction,
  setHoursAction
} from "../store/actions";

import "../style/TeamMate.scss";

class TeamMate extends React.Component {

  static propTypes = {
    id: PropTypes.string,
    mate: PropTypes.object,
    edit: PropTypes.bool
  };

  _onChangeD = (ev) => {
    const value = ev.target.value ? parseFloat(ev.target.value) : parseFloat(0);
    if (0 <= value) {
      this.props.setDays(this.props.id, value);
    }
  };

  _onChangeH = (ev) => {
    const value = ev.target.value ? parseFloat(ev.target.value) : parseFloat(0);
    if (0 <= value) {
      this.props.setHours(this.props.id, value);
    }
  };

  _onChangeEff = (ev) => {
    const value = ev.target.value ? parseFloat(ev.target.value) : parseFloat(0);
    if (0 <= value && value <= 100) {
      this.props.setEfficiency(this.props.id, value)
    }
  };

  _onMinusClick = () => this.props.deleteMate(this.props.id);

  render() {
    const { mate, edit } = this.props;

    const hours = ((mate.d * 8 + mate.h) * mate.efficiency / 100)* (100 -this.props.emergency) / 100;

    return (
      <div className="teammate">
        <div className="column">
          {edit &&
            <AwIcon
              iconName="times"
              className="minus"
              onClick={this._onMinusClick}
            />
          }
          {mate.name}<span className="hours4every">({parseInt(hours)} h)</span>
        </div>

        <div className="column">
          <input
            type="number"
            defaultValue={mate.d}
            min={0}
            max={100}
            onChange={this._onChangeD}
          />
          <span>d</span>
          <input
            type="number"
            defaultValue={mate.h}
            min={0}
            max={100}
            onChange={this._onChangeH}
          />
          <span>h</span>
        </div>

        <div className="column">
          <input
            type="number"
            defaultValue={mate.efficiency}
            min={0}
            max={100}
            onChange={this._onChangeEff}
          />
          <span>%</span>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  mate: state.mates[ownProps.id]
});

const mapDispatchToProps = dispatch => ({
  setDays: (id, days) => dispatch(setDaysAction(id, days)),
  setHours: (id, hours) => dispatch(setHoursAction(id, hours)),
  setEfficiency: (id, efficiency) => dispatch(setEfficiencyAction(id, efficiency)),
  deleteMate: (id) => dispatch(deleteMateAction(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(TeamMate);