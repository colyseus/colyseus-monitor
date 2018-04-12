import * as React from "react";
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from "material-ui/Table";

import RaisedButton from 'material-ui/RaisedButton';

const buttonStyle = { marginRight: 12 };

export class RoomList extends React.Component {
  state = {
    selected: [1],
    rows: []
  };

  isSelected = (index) => {
    return this.state.selected.indexOf(index) !== -1;
  };

  componentWillMount () {

  }

  handleRowSelection = (selectedRows) => {
    this.setState({
      selected: selectedRows,
    });
  };

  render() {
    return (
      <Table>
        <TableHeader displaySelectAll={false}>
          <TableRow>
            <TableHeaderColumn>roomId</TableHeaderColumn>
            <TableHeaderColumn>handler</TableHeaderColumn>
            <TableHeaderColumn>clients</TableHeaderColumn>
            <TableHeaderColumn>maxClients</TableHeaderColumn>
            <TableHeaderColumn>elapsedTime</TableHeaderColumn>
            <TableHeaderColumn>state size</TableHeaderColumn>
            <TableHeaderColumn>actions</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
            <TableRow></TableRow>
            { this.state.rows.forEach((room, i) => (
                <TableRow>
                    <TableRowColumn>#138hf91hf</TableRowColumn>
                    <TableRowColumn>chat</TableRowColumn>
                    <TableRowColumn>10</TableRowColumn>
                    <TableRowColumn>20</TableRowColumn>
                    <TableRowColumn>300kb</TableRowColumn>
                    <TableRowColumn>250s</TableRowColumn>
                    <TableRowColumn>
                        <RaisedButton label="Inspect" style={buttonStyle} />
                        <RaisedButton label="Dispose" style={buttonStyle} />
                        {/* <RaisedButton label="Broadcast" style={buttonStyle} /> */}
                    </TableRowColumn>
                </TableRow>
            )) }
        </TableBody>
      </Table>
    );
  }
}
