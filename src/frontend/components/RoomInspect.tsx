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
import RemoveIcon from 'material-ui/svg-icons/content/remove';
import SendIcon from 'material-ui/svg-icons/content/send';

const buttonStyle = { marginRight: 12 };

export class RoomInspect extends React.Component {
    state = {
        room: {},
        clients: []
    };

    componentWillMount() {
        const roomId = (this.props as any).match.params.roomId

        http.get(`http://localhost:2567/colyseus/api/room`).
            query({ roomId: roomId }).
            accept('application/json').
            then((response) => {
                const room = response.body;
                this.setState({ roomId, room });
            }).
            catch((err) => console.error(err));
    }

    sendMessage(sessionId: string) {
        console.log("SEND MESSAGE TO CLIENT", sessionId);
    }

    render() {
        return (
            <Card>
                <h2>Room</h2>
                <h2>State</h2>
                <h2>Clients</h2>
                <Table>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn>id</TableHeaderColumn>
                            <TableHeaderColumn>sessionId</TableHeaderColumn>
                            <TableHeaderColumn>platform</TableHeaderColumn>
                            <TableHeaderColumn>actions</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {this.state.clients.map((client, i) => (
                            <TableRow key={client.id}>
                                <TableRowColumn>{client.id}</TableRowColumn>
                                <TableRowColumn>{client.sessionId}</TableRowColumn>
                                <TableRowColumn>{client.userAgent}</TableRowColumn>
                                <TableRowColumn>
                                    <RaisedButton
                                        label="Send"
                                        icon={<SendIcon />}
                                        onClick={this.sendMessage.bind(this, client.sessionId)}
                                        style={buttonStyle} />

                                    <RaisedButton
                                        label="Disconnect"
                                        secondary={true}
                                        icon={<RemoveIcon />}
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
