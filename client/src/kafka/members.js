import React from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import { RouteComponentProps } from "react-router-dom";
import { KafkaToolbar} from '../components/toolbar';
import { DataView} from '../components/data_view';
import { ErrorMsg} from '../components/error_msg';
import { Url } from "../components/url";
import { CancelToken, Loader } from "../components/loader";

// type State = {
//     loading: boolean;
//     error: any;
//     rows: any[];
// }

export class Members extends React.Component  {
    state= { loading: true, rows: [], error: "" }
    url;
    loader = new Loader()

    constructor(props) {
        super(props);
        this.url = new Url(props.location.search, ``);
    }

    async componentDidMount() {
        await this.loader.Load(this.fetchMembers)
    }

    componentWillUnmount() {
        this.loader.Abort()
    }

    fetchMembers = async (cancelToken) => {
        const data = await cancelToken.Fetch(`/api/members/${this.props.match.params.group}`)
        if (cancelToken.Aborted) return
        if (data.error) {
            this.setState({loading: false, error: data.error })
            return
        }
        this.setState({ loading: false, rows: data })
    }

    getColumnDefs() {
        return [
            { headerName: "Member ID", field: "memberId" },
            { headerName: "Client ID", field: "clientId" },
            { headerName: "Client Host", field: "clientHost" },
        ]
    }

    render() {
        return (
            <>
                <KafkaToolbar
                    title={`Members for group: ${this.props.match.params.group}`}
                    url={this.url}
                >
                </KafkaToolbar>
                {this.state.loading && <><CircularProgress /><div>Loading...</div></>}
                <ErrorMsg error={this.state.error} prefix="Failed to fetch members. Error: "></ErrorMsg>
                {!this.state.loading && <DataView
                    search={r => `${r.memberId},${r.clientId},${r.clientHost}`}
                    rows={this.state.rows}
                    raw={this.state.rows}
                    url={this.url}
                    columnDefs={this.getColumnDefs()}>
                </DataView>}
            </>
        )
    }
}