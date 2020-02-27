import React, {Fragment} from 'react';
import PropTypes from "prop-types";
import AwIcon from "awicons-react";
import { connect } from "react-redux";
import { map, forEach } from 'lodash';

import "../style/App.scss";

import { HeadingTitle } from "./HeadingTitle";
import HoursPlanning from "./HoursPlanning";
import {calcTotal, decodeJSON} from "../utilities";
import {  setTeamAction } from "../store/actions";


class HomePage extends React.Component {

  static propTypes = {
    teamName: PropTypes.string,
    mates: PropTypes.object,
    groups: PropTypes.object
  };

  fileRef = React.createRef();

  state = {
    fileJSON: null
  };

  fileReader = new FileReader();

  componentDidMount() {

    this.fileReader.onload = (event) => {
      try {
        let json = JSON.parse(event.target.result);
        this.setState(() => ({fileJSON: json}));
      }
      catch (e) {
        console.error(e);
      }
    };

    this.fileReader.onerror = (error) => {
      console.error(error);
    }
  }

  componentWillUpdate(nextProps, nextState, nextContext) {
    if (this.state.fileJSON !== nextState.fileJSON) {
      if(nextState.fileJSON.hasOwnProperty("people")) {
        const { info, groups, mates } = decodeJSON(nextState.fileJSON);
        this.props.setTeam(info, groups, mates);
      }
      else {
        console.error("Invalid json")
      }
    }
  }

  _importClick = () => {
    this.fileRef.current.click();
  };

  _onChangeFile = (event) => {
    event.stopPropagation();
    event.preventDefault();

    let file = event.target.files[0];
    this.fileReader.readAsText(file);
  };

  render() {
    const { teamName, groups, mates } = this.props;

    const groupsRendered = map(groups, (group, key) =>
      <HoursPlanning groupId={key} key={key} />
    );

    let total = 0;
    forEach(groups, (group) => {
      total = total  + calcTotal(mates, group.mates, group.emergency);
    });

    return (
      <div className="page">
        <HeadingTitle teamName={teamName}/>
        <AwIcon
          iconName="upload"
          className="uploadIcon"
          onClick={this._importClick}
        />
        <input
          type="file"
          accept=".json"
          ref={this.fileRef}
          style={{display: "none"}}
          onChange={this._onChangeFile}
        />

        <div className="sprintPlanning">

          <Fragment>
            {groupsRendered}
          </Fragment>

          <div className="recap">
            Totale: {parseInt(total)} h
          </div>
        </div>

      </div>
    )
  }
}

const mapStateToProps = state => {
  return({
    teamName: state.info.teamName,
    mates: state.mates,
    groups: state.groups
  });
};

const mapDispatchToProps = dispatch => ({
  setTeam: (info, groups, mates) => dispatch(setTeamAction(info, groups, mates))
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
