import React from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import { RouteComponentProps } from "react-router-dom";
import { KafkaToolbar} from '../common/toolbar';
import { DataView} from '../common/data_view';
import { ErrorMsg} from '../common/error_msg';
import { Url } from "../common/url";
import { ConnectorConfig, ConnectorState, GetConnectorConfigResult, GetConnectorsResult, GetConnectorStatusResult } from "../../shared/api";
import { CellButton, CellProps } from "../common/cell_button";
import { ColDef, GridApi, GridReadyEvent } from "ag-grid-community";
import { History } from 'history';
import { CancelToken, Loader } from "../common/loader";

// type State = {
//     loading: boolean;
//     error?: string;
//     customCols: {cols: {}};
//     rows: Connector[];
// }

// type Connector = {
//     name: string;
//     state: ConnectorState | "Loading";
//     workerId: string | "Loading";
//     numTasks?: number;
//     type: string | "Loading";
//     config?: ConnectorConfig;
//     history: History<unknown>;
// }

class ViewTasksButton  {
    render() {
        return <CellButton getUrl={() => `/kafka-connect/tasks/${this.props.data.name}`} {...this.props} />
    }
}

//this is needed for ag-grid to correctly detect the field mappings (it interprets dots as deep references)
export function ReplaceDots(data) {
    const res = {}
    for (const prop in data) {
        res[prop.split('.').join('->')] = data[prop]
    }
    return res
}

export class Connectors  {
    state = { loading: true, customCols: {cols: {}}, rows: [], error: "" }
    gridApi = null;
    url;
    loader = new Loader()

    constructor(props) {
        super(props);
        this.url = new Url(props.location.search, ``);
    }

    onGridReady = (params) => {
        this.gridApi = params.api;
    }

    async componentDidMount() {
        await this.loader.Load(this.fetchConnectors)
    }

    componentWillUnmount() {
        this.loader.Abort()
    }

    fetchConnectors = async (cancelToken) => {
        const data = await cancelToken.Fetch(`/api/kafka-connect/connectors`)
        if (cancelToken.Aborted) return
        if (data.error) {
            this.setState({loading: false, error: data.error})
            return
        }
        const rows = data.map(c => ({name: c, state: "Loading", workerId: "Loading", type: "Loading", history: this.props.history}))
        this.setState({ loading: false, rows })
        for (const connector of rows) {
            await this.fetchConnector(connector, cancelToken)
        }
    }

    async fetchConnector(connector, cancelToken) {
        await this.fetchConnectorStatus(connector, cancelToken)
        if (cancelToken.Aborted) return
        await this.fetchConnectorConfig(connector, cancelToken)
        if (cancelToken.Aborted) return
    }

    async fetchConnectorStatus(connector, cancelToken) {
        const data = await cancelToken.Fetch(`/api/kafka-connect/connector/${connector.name}/status`)
        if (cancelToken.Aborted) return
        if (data.error) {
            this.setState({loading: false, error: data.error})
            return
        }
        connector.numTasks = data.tasks.length
        connector.state = data.connector.state
        connector.workerId = data.connector.worker_id
        connector.type = data.type
        if (this.gridApi) {
            this.gridApi.refreshCells()
        }
        this.forceUpdate();
    }

    async fetchConnectorConfig(connector, cancelToken) {
        let data = await cancelToken.Fetch(`/api/kafka-connect/connector/${connector.name}/config`)
        if (cancelToken.Aborted) return
        if (data.error) {
            this.setState({loading: false, error: data.error})
            return
        }
        data = ReplaceDots(data)
        connector.config = data
        this.state.customCols.cols = {...this.state.customCols.cols, ...data}
        this.refreshGrid()
    }

    refreshGrid() {
        if (this.gridApi) {
            this.gridApi.refreshCells({force: true})
        }
        this.forceUpdate();
    }

    getColumnDefs() {
        const cols = [
            { headerName: "Name", field: "name" },
            { headerName: "State", field: "state", type: "connectorState" },
            { headerName: "Worker ID", field: "workerId" },
            { headerName: "Type", field: "type" },
            { headerName: "#Tasks", field: "numTasks", filter: "agNumberColumnFilter", cellRendererFramework: ViewTasksButton },
        ]
        for (const prop in this.state.customCols.cols) {
            const field = `config.${prop}`
            const orig = prop.split('->').join('.')
            const headerName = `config.${orig}`
            cols.push({headerName, field})
        }
        return cols
    }

    render() {
        return (
            <>
                <KafkaToolbar
                    title="Connectors"
                    url={this.url}
                    OnThemeChanged={ _ => this.refreshGrid()}
                >
                </KafkaToolbar>
                {this.state.loading && <><CircularProgress /><div>Loading...</div></>}
                <ErrorMsg error={this.state.error} prefix="Failed to fetch connectors. Error: "></ErrorMsg>
                {!this.state.loading && <DataView
                    search={(r) => `${r.name},${r.state},${r.type},${r.workerId}`}
                    rows={this.state.rows}
                    raw={this.state.rows}
                    url={this.url}
                    columnDefs={this.getColumnDefs()}
                    onGridReady={this.onGridReady}>
                </DataView>}
            </>
        )
    }
}