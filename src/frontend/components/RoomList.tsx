import * as React from "react";
import * as http from "superagent";

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from "material-ui/Table";

import {
  Card,
  CardActions,
  CardHeader,
  CardText
} from 'material-ui/Card';

import RaisedButton from 'material-ui/RaisedButton';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import DeleteForeverIcon from 'material-ui/svg-icons/action/delete-forever';
import OpenInBrowserIcon from 'material-ui/svg-icons/action/open-in-browser';

import { styles } from "../styles";

const buttonStyle = { marginRight: 12 };

const defaultColumnWidth = { width: "11%" };
const largeColumnWidth = { width: "34%" };

export class RoomList extends React.Component {
  state = {
    selected: [1],
    rooms: []
  };

  isSelected = (index) => {
    return this.state.selected.indexOf(index) !== -1;
  };

  componentWillMount() {
    http.get("http://localhost:2567/colyseus/api").
      accept('application/json').
      then((response) => {
        const data = response.body;
        const rooms = [];

        for (let handlerName in data) {
          for (let i = 0; i < data[handlerName].length; i++) {
            let room = data[handlerName][i];
            room.handler = handlerName;

            rooms.push(room);
          }
        }

        this.setState({ rooms });
      }).
      catch((err) => console.error(err));
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

  render() {
    return (
      <Card>
        <Table>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn style={defaultColumnWidth}>roomId</TableHeaderColumn>
              <TableHeaderColumn style={defaultColumnWidth}>handler</TableHeaderColumn>
              <TableHeaderColumn style={defaultColumnWidth}>clients</TableHeaderColumn>
              <TableHeaderColumn style={defaultColumnWidth}>maxClients</TableHeaderColumn>
              <TableHeaderColumn style={defaultColumnWidth}>elapsedTime</TableHeaderColumn>
              <TableHeaderColumn style={defaultColumnWidth}>state size</TableHeaderColumn>
              <TableHeaderColumn style={largeColumnWidth}>actions</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.state.rooms.map((room, i) => (
              <TableRow key={room.roomId}>
                <TableRowColumn style={defaultColumnWidth}>{room.roomId}</TableRowColumn>
                <TableRowColumn style={defaultColumnWidth}>{room.handler}</TableRowColumn>
                <TableRowColumn style={defaultColumnWidth}>{room.clients}</TableRowColumn>
                <TableRowColumn style={defaultColumnWidth}>{room.maxClients}</TableRowColumn>
                <TableRowColumn style={defaultColumnWidth}>250s</TableRowColumn>
                <TableRowColumn style={defaultColumnWidth}>300kb</TableRowColumn>
                <TableRowColumn style={largeColumnWidth}>
                  <RaisedButton
                    label="Inspect"
                    icon={<OpenInBrowserIcon />}
                    onClick={this.inspectRoom.bind(this, room.roomId)}
                    style={buttonStyle} />

                  <RaisedButton
                    label="Dispose"
                    secondary={true}
                    icon={<DeleteForeverIcon />}
                    style={buttonStyle} />
                  {/* <RaisedButton label="Broadcast" style={buttonStyle} /> */}
                </TableRowColumn>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    );
  }
}
