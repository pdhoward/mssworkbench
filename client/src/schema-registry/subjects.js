import React from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import { KafkaToolbar} from '../components/toolbar';
import { DataView} from '../components/data_view';
import { RouteComponentProps } from "react-router-dom";
import { CellProps, CellButton } from '../components/cell_button';
import { GridApi, ColumnApi, GridReadyEvent } from 'ag-grid-community';
import { ErrorMsg} from '../components/error_msg';
import { Url } from "../components/url";
import { GetSubjectsResult, GetSubjectVersionsResult } from "../shared/api";
import { History } from 'history';
import { CancelToken, Loader } from "../components/loader";

// type State = {
//     loading: boolean;
//     rows: Subject[];
//     error?: string;
//     errorPrefix: string;
// }

class ViewVersionsButton {
    render() {
        return <CellButton getUrl={() => `/schema-registry/versions/${this.props.data.subject}`} {...this.props} />
    }
}

// type Subject = {
//     subject: string,
//     versions?: GetSubjectVersionsResult,
//     num_versions?: number,
//     history: History<unknown>,
// }

export class Subjects extends React.Component {
    state = { loading: true, rows: [], error: "", errorPrefix: "" }
    gridApi = null;
    columnApi = null;
    url;
    loader = new Loader()

    constructor(props) {
        super(props);
        this.url = new Url(props.location.search, ``);
    }

    onGridReady = (params) => {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
    }

    async componentDidMount() {
        await this.loader.Load(this.fetchSubjects)
    }

    componentWillUnmount() {
        this.loader.Abort()
    }

    fetchSubjects = async (cancelToken) => {
        const data = await cancelToken.Fetch(`/api/schema-registry/subjects`)
        if (cancelToken.Aborted) return
        if (data.error) {
            this.setState({ loading: false, error: data.error, errorPrefix: "Failed to fetch subjects. Error: "})
            return
        }
        const results = data.map(r => (
            { subject: r, history: this.props.history }))
        this.setState({ loading: false, rows: results })
        for (const subject of results) {
            await this.fetchSubject(subject, cancelToken)
            if (cancelToken.Aborted) return
        }
    }

    async fetchSubject(subject, cancelToken) {
        const data = await cancelToken.Fetch(`/api/schema-registry/versions/${subject.subject}`)
        if (cancelToken.Aborted) return
        if (data.error) {
            this.setState({ loading: false, error: data.error, errorPrefix: `Failed to fetch subject ${subject.subject}. Error: `})
            return
        }
        subject.num_versions = data.length
        subject.versions = data
        if (this.gridApi) {
            this.gridApi.refreshCells()
        }
        this.forceUpdate();
    }

    getColumnDefs() {
        return [
            { headerName: "Subject", field: "subject" },
            { headerName: "#Versions", field: "num_versions", filter: "agNumberColumnFilter", cellRendererFramework: ViewVersionsButton },
        ]
    }

    render() {
        return (
            <>
                <KafkaToolbar
                    title="Subjects"
                    url={this.url}
                >
                </KafkaToolbar>
                {this.state.loading && <><CircularProgress /><div>Loading...</div></>}
                <ErrorMsg error={this.state.error} prefix={this.state.errorPrefix}></ErrorMsg>
                {!this.state.loading && <DataView
                    search={(r) => r.subject}
                    rows={this.state.rows}
                    raw={this.state.rows.map(r => ({subject: r.subject, versions: r.versions}))}
                    url={this.url}
                    columnDefs={this.getColumnDefs()}
                    onGridReady={this.onGridReady}
                    >
                </DataView>}
            </>
        )
    }
}