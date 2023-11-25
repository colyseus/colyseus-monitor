import * as React from "react";

import { fetchRoomList, remoteRoomCall } from "../services";

import { Card, Button, Typography} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import {
  Fab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

const buttonStyle = { marginRight: 12 };

const defaultColumnWidth = { width: "11%" };
const largeColumnWidth = { width: "34%" };

const UPDATE_ROOM_LIST_INTERVAL = 5000;

export class RoomList extends React.Component {
  state = {
    selected: [1],
    rooms: [],
    connections: 0,
    cpu: 0,
    memory: { totalMemMb: 0, usedMemMb: 0 },
    columns: [],
  };

  updateRoomListInterval: number;

  isSelected = (index) => {
    return this.state.selected.indexOf(index) !== -1;
  };

  componentWillMount() {
    this.fetchRoomList();
  }

  async fetchRoomList () {
    try {
      this.setState((await fetchRoomList()).body);

    } catch (err) {
      console.error(err)
    }

    clearInterval(this.updateRoomListInterval);

    this.updateRoomListInterval = window.setInterval(() =>
      this.fetchRoomList(), UPDATE_ROOM_LIST_INTERVAL);
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

  async disposeRoom(roomId) {
    await remoteRoomCall(roomId, "disconnect");
    this.fetchRoomList();
  }

  getColumnHeader(column) {
    return (typeof (column) === "string")
      ? column
      : column.metadata
  }

  getRoomColumn(room, column) {
    let field = column;
    let value: any;
    let valueFromObject: any = room;

    let postProcessValue: (_: any) => string;

    if (field === "elapsedTime") {
      postProcessValue = this.millisecondsToStr;

    } else if (column.metadata && room.metadata) {
      field = column.metadata;
      valueFromObject = room.metadata;
    }

    value = valueFromObject[field];

    if (value === undefined) {
      value = "";
    }

    return (postProcessValue) ? postProcessValue(value) : `${value}`;
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

  getColumnsNames(columns: any): Array<any> {
    const data = columns.map(column => {
      const value = this.getColumnHeader(column);
      return { id: value, field: value, headerName: value, flex: 1 }
    });
    data.push({
      id: "Inspect",
      field: "Inspect",
      headerName: "Inspect",
      flex: 1,
      renderCell: (param) => {
        return <div style={{ cursor: "pointer" }} onClick={() => {
          this.inspectRoom(param.value);
        }}>
          <Button variant="contained" startIcon={<OpenInBrowserIcon />}>
            <Typography
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'none', md: "block" } }}
            >
              INSPECT
            </Typography>
          </Button>
        </div>
      }
    });
    data.push({
      id: "Dispose",
      field: "Dispose",
      headerName: "Dispose",
      flex: 1,
      renderCell: (param) => {
        return <div style={{ cursor: "pointer" }} onClick={() => {
          this.disposeRoom(param.value);
        }}>
          <Button variant="contained" color="error" startIcon={<DeleteForeverIcon />}>
            <Typography
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'none', md: "block" } }}
            >
              DISPOSE
            </Typography>
          </Button>
        </div>
      }
    });
    return data;
  }

  getRowsData(rooms: any): Array<any> {
    const total_data = rooms.map(room => {
      const data = { id: room.roomId };
      for (const column of this.state.columns) {
        const value = this.getRoomColumn(room, column);
        data[column] = value;
      }
      data["Inspect"] = room.roomId;
      data["Dispose"] = room.roomId;
      return data
    });
    return total_data
  }

  generateRoomListDataGrid(): JSX.Element {
    const columns = this.getColumnsNames(this.state.columns);
    const rows = this.getRowsData(this.state.rooms);

    return <DataGrid
      columns={columns}
      rows={rows}
      autoHeight
      sx={{ overflow: "hidden" }}
      slots={{
        noRowsOverlay: () => <></>,
      }}
      disableRowSelectionOnClick
      hideFooter
      hideFooterPagination
      hideFooterSelectedRowCount
    />
  }

  render() {
    return (
      <div>
        <Card>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align={"center"}>
                    Connections
                    <Fab sx={{ marginLeft: "6px" }} variant="extended" size="small" color="primary" aria-label="add">
                      {this.state.connections}
                    </Fab>
                  </TableCell>
                  <TableCell align={"center"}>
                    Rooms
                    <Fab sx={{ marginLeft: "6px" }} variant="extended" size="small" color="primary" aria-label="add">
                      {this.state.rooms.length}
                    </Fab>
                  </TableCell>
                  <TableCell align={"center"}>
                    CPU Usage
                    <Fab sx={{ marginLeft: "6px" }} variant="extended" size="small" color="primary" aria-label="add">
                      {this.state.cpu} %
                    </Fab>
                  </TableCell>
                  <TableCell align={"center"}>
                    Memory
                    <Fab sx={{ marginLeft: "6px" }} variant="extended" size="small" color="primary" aria-label="add">
                      {this.state.memory.usedMemMb} MB
                    </Fab>
                  </TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </TableContainer>
        </Card>
        <Card style={{ marginTop: "2px" }}>
          {this.generateRoomListDataGrid()}
        </Card>
      </div>
    );
  }

}
