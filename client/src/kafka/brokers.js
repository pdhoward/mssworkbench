import React from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import { RouteComponentProps } from "react-router-dom";
import { KafkaToolbar} from '../component/toolbar';
import { DataView} from '../component/data_view';
import { ErrorMsg} from '../component/error_msg';
import { Url } from "../component/url";
import { Broker, GetClusterResult } from "../../shared/api";
import { CancelToken, Loader } from "../component/loader";
import { CellButton, CellProps } from "../component/cell_button";
import { History } from 'history';

// type State = {
//     loading: boolean;
//     error?: string;
//     rows: BrokerRow[];
// }

// type BrokerRow = { history: History<unknown> } & Broker

class ViewConfigsButton  {
    render() {
        return <CellButton getUrl={() => `/broker/configs/${this.props.data.nodeId}`} data={this.props.data} value="View"/>
    }
}

export class Brokers extends React.Component  {
    state = { loading: true, rows: [], error: "" }
    url;
    loader = new Loader()

    constructor(props) {
        super(props);
        this.url = new Url(props.location.search, ``);
    }

    async componentDidMount() {
        await this.loader.Load(this.fetchBrokers)
    }

    componentWillUnmount() {
        this.loader.Abort()
    }

    fetchBrokers = async (cancelToken) => {
        const data = await cancelToken.Fetch(`/api/cluster`)
        if (cancelToken.Aborted) return
        if (data.error) {
            this.setState({loading: false, error: data.error})
            return
        }
        const rows = data.brokers.map((r) => { return { history: this.props.history, ...r }})
        this.setState({ loading: false, rows })
    }

    getColumnDefs() {
        return [
            { headerName: "Node ID", field: "nodeId", filter: "agNumberColumnFilter" },
            { headerName: "Host", field: "host" },
            { headerName: "Port", field: "port", filter: "agNumberColumnFilter" },
            { headerName: "Configs", field: "view_configs", cellRendererFramework: ViewConfigsButton },
        ]
    }

    render() {
        return (
            <>
                <KafkaToolbar
                    title="Brokers"
                    url={this.url}
                >
                </KafkaToolbar>
                {this.state.loading && <><CircularProgress /><div>Loading...</div></>}
                <ErrorMsg error={this.state.error} prefix="Failed to fetch brokers. Error: "></ErrorMsg>
                {!this.state.loading && <DataView
                    search={(r) => r.host}
                    rows={this.state.rows}
                    raw={this.state.rows}
                    url={this.url}
                    columnDefs={this.getColumnDefs()}>
                </DataView>}
            </>
        )
    }
}