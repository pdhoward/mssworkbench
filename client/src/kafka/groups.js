import React from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import { RouteComponentProps } from "react-router-dom";
import { CellProps, CellButton } from '../component/cell_button';
import { KafkaToolbar} from '../component/toolbar';
import { DataView} from '../component/data_view';
import { ErrorMsg} from '../component/error_msg';
import { Url } from "../component/url";
import { CancelToken, Loader } from "../component/loader";

// type State = {
//     loading: boolean;
//     error: any;
//     rows: any[];
// }

class ViewMembersButton  {
    render() {
        return <CellButton getUrl={() => `/members/${this.props.data.groupId}`} {...this.props} />
    }
}

export class Groups extends React.Component {
    state = { loading: true, rows: [], error: "" }
    url;
    loader = new Loader()

    constructor(props) {
        super(props);
        this.url = new Url(props.location.search, ``);
    }

    async componentDidMount() {
        await this.loader.Load(this.fetchGroups)
    }

    componentWillUnmount() {
        this.loader.Abort()
    }

    fetchGroups = async (cancelToken) => {
        const data = await cancelToken.Fetch(`/api/groups`)
        if (cancelToken.Aborted) return
        if (data.error) {
            this.setState({loading: false, error: data.error})
            return
        }
        const results = data.groups.map((r) => {
            return { numMembers: r.members.length, raw: r, history: this.props.history, ...r }
        })
        this.setState({ loading: false, rows: results })
    }

    getColumnDefs() {
        return [
            { headerName: "Group ID", field: "groupId" },
            { headerName: "Protocol", field: "protocol" },
            { headerName: "Protocol Type", field: "protocolType" },
            { headerName: "State", field: "state" },
            { headerName: "#Members", field: "numMembers", filter: "agNumberColumnFilter", cellRendererFramework: ViewMembersButton }
        ]
    }

    render() {
        return (
            <>
                <KafkaToolbar
                    title="Groups"
                    url={this.url}
                >
                </KafkaToolbar>
                {this.state.loading && <><CircularProgress /><div>Loading...</div></>}
                <ErrorMsg error={this.state.error} prefix="Failed to fetch groups. Error: "></ErrorMsg>
                {!this.state.loading && <DataView
                    search={r => `${r.groupId},${r.protocol},${r.protocolType}`}
                    rows={this.state.rows}
                    raw={this.state.rows.map(r => r.raw)}
                    url={this.url}
                    columnDefs={this.getColumnDefs()}>
                </DataView>}
            </>
        )
    }
}