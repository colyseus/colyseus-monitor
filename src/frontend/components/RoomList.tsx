import * as React from "react";
import * as http from "superagent";

import { fetchRoomList, remoteRoomCall } from "../services";

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
  TableFooter,
} from "material-ui/Table";

import {
  Card,
  CardActions,
  CardHeader,
  CardText
} from 'material-ui/Card';

import FlatButton from 'material-ui/FlatButton';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import DeleteForeverIcon from 'material-ui/svg-icons/action/delete-forever';
import OpenInBrowserIcon from 'material-ui/svg-icons/action/open-in-browser';
import SendIcon from 'material-ui/svg-icons/content/send';

import { styles } from "../styles";

const buttonStyle = { marginRight: 12 };

const defaultColumnWidth = { width: "11%" };
const largeColumnWidth = { width: "34%" };

const UPDATE_ROOM_LIST_INTERVAL = 5000;

export class RoomList extends React.Component {
  state = {
    selected: [1],
    rooms: []
  };

  updateRoomListInterval: number;

  isSelected = (index) => {
    return this.state.selected.indexOf(index) !== -1;
  };

  componentWillMount() {
    this.fetchRoomList();
  }

  fetchRoomList () {
    fetchRoomList().
      then((response) => {
        const rooms = response.body;
        this.setState({ rooms });
      }).
      catch((err) => console.error(err));

    clearInterval(this.updateRoomListInterval);

    this.updateRoomListInterval = window.setInterval(() => this.fetchRoomList(), UPDATE_ROOM_LIST_INTERVAL);
  }

  handleRowSelection = (selectedRows) => {
    this.setState({
      selected: selectedRows,
    });
  };

  inspectRoom(roomId) {
    const history = (this.props as any).history;
    history.push('/room/' + roomId);
  }

  disposeRoom(roomId) {
    remoteRoomCall(roomId, "disconnect").
      then(() => this.fetchRoomList());
  }

  millisecondsToStr(milliseconds) {
    let temp = Math.floor(milliseconds / 1000);

    const years = Math.floor(temp / 31536000);
    if (years) {
      return years + 'y';
    }

    const days = Math.floor((temp %= 31536000) / 86400);
    if (days) {
      return days + 'd';
    }

    const hours = Math.floor((temp %= 86400) / 3600);
    if (hours) {
      return hours + 'h';
    }

    const minutes = Math.floor((temp %= 3600) / 60);
    if (minutes) {
      return minutes + 'min';
    }

    const seconds = temp % 60;
    if (seconds) {
      return seconds + 's';
    }

    return 'less than a second';
  }

  bytesToStr(size: number) {
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return ((size / Math.pow(1024, i)).toFixed(2) as any) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
  }


  render() {
    return (
      <Card>
        <Table>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn style={defaultColumnWidth}>roomId</TableHeaderColumn>
              <TableHeaderColumn style={defaultColumnWidth}>roomName</TableHeaderColumn>
              <TableHeaderColumn style={defaultColumnWidth}>clients</TableHeaderColumn>
              <TableHeaderColumn style={defaultColumnWidth}>maxClients</TableHeaderColumn>
              <TableHeaderColumn style={defaultColumnWidth}>locked</TableHeaderColumn>
              <TableHeaderColumn style={defaultColumnWidth}>elapsedTime</TableHeaderColumn>
              <TableHeaderColumn style={largeColumnWidth}>actions</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.state.rooms.map((room, i) => (
              <TableRow key={room.roomId}>
                <TableRowColumn style={defaultColumnWidth}>{room.roomId}</TableRowColumn>
                <TableRowColumn style={defaultColumnWidth}>{room.roomName}</TableRowColumn>
                <TableRowColumn style={defaultColumnWidth}>{room.clients}</TableRowColumn>
                <TableRowColumn style={defaultColumnWidth}>{room.maxClients}</TableRowColumn>
                <TableRowColumn style={defaultColumnWidth}>{(room.locked || false).toString()}</TableRowColumn>
                <TableRowColumn style={defaultColumnWidth}>{ this.millisecondsToStr(room.elapsedTime) }</TableRowColumn>
                <TableRowColumn style={largeColumnWidth}>
                  <FlatButton
                    label="Inspect"
                    icon={<OpenInBrowserIcon />}
                    onClick={this.inspectRoom.bind(this, room.roomId)}
                    style={buttonStyle}
                  />

                  <FlatButton
                    label="Dispose"
                    secondary={true}
                    icon={<DeleteForeverIcon />}
                    style={buttonStyle}
                    onClick={this.disposeRoom.bind(this, room.roomId)}
                  />
                </TableRowColumn>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </Card>
    );
  }

}
