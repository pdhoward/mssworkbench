import React from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import { RouteComponentProps } from "react-router-dom";
import { KafkaToolbar} from '../component/toolbar';
import { DataView} from '../component/data_view';
import { ErrorMsg} from '../component/error_msg';
import { Url } from "../component/url";
import { ConnectorConfig, ConnectorState, GetConnectorTasksResult, GetConnectorTaskStatusResult } from "../../shared/api";
import { ColDef, GridApi, GridReadyEvent } from "ag-grid-community";
import { ReplaceDots } from "./connectors";
import { CancelToken, Loader } from "../component/loader";

// type State = {
//     loading: boolean;
//     error?: string;
//     customCols: {cols: {}};
//     rows: Task[];
// }

// type Task = {
//     id: number;
//     state: ConnectorState | "Loading";
//     workerId: string | "Loading";
//     config: ConnectorConfig;
// }

export class Tasks extends React.Component  {
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
        await this.loader.Load(this.fetchTasks)
    }

    componentWillUnmount() {
        this.loader.Abort()
    }

    fetchTasks = async (cancelToken) => {
        const data = await cancelToken.Fetch(`/api/kafka-connect/connector/${this.props.match.params.connector}/tasks`)
        if (cancelToken.Aborted) return
        if (data.error) {
            this.setState({loading: false, error: data.error})
            return
        }
        const rows = []
        for (const c of data) {
            const config = ReplaceDots(c.config)
            rows.push({id: c.id.task, state: "Loading", workerId: "Loading", config })
            this.state.customCols.cols = {...this.state.customCols.cols, ...config}
        }
        this.setState({ loading: false, rows })
        for (const c of rows) {
            await this.fetchTaskStatus(c, cancelToken)
            if (cancelToken.Aborted) return
        }
    }

    async fetchTaskStatus(task, cancelToken) {
        const data = await cancelToken.Fetch(`/api/kafka-connect/connector/${this.props.match.params.connector}/tasks/${task.id}/status`)
        if (cancelToken.Aborted) return
        if (data.error) {
            this.setState({loading: false, error: data.error})
            return
        }
        task.state = data.state
        task.workerId = data.worker_id
        this.refreshGrid()
    }

    refreshGrid() {
        if (this.gridApi) {
            this.gridApi.refreshCells()
        }
        this.forceUpdate();
    }

    getColumnDefs() {
        const cols = [
            { headerName: "ID", field: "id" },
            { headerName: "State", field: "state", type: "connectorState" },
            { headerName: "Worker ID", field: "workerId" },
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
                    title={`Tasks for connector: ${this.props.match.params.connector}`}
                    url={this.url}
                    OnThemeChanged={_ => this.refreshGrid()}
                >
                </KafkaToolbar>
                {this.state.loading && <><CircularProgress /><div>Loading...</div></>}
                <ErrorMsg error={this.state.error} prefix="Failed to fetch tasks. Error: "></ErrorMsg>
                {!this.state.loading && <DataView
                    search={(r) => `${r.state},${r.workerId}`}
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