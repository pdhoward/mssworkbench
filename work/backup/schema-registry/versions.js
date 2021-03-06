import React from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import { KafkaToolbar} from '../components/toolbar';
import { DataView} from '../components/data_view';
import { RouteComponentProps } from "react-router-dom";
import { GridApi, ColumnApi, GridReadyEvent } from 'ag-grid-community';
import { ErrorMsg} from '../components/error_msg';
import { Url } from "../components/url";
import { GetSchemaResult, GetSubjectVersionsResult } from "../shared/api";
import { Schema } from "avsc";
import { CancelToken, Loader } from "../components/loader";


// type State = {
//     loading: boolean;
//     rows: any[];
//     customCols: {cols: {}};
//     error?: string;
//     errorPrefix: string;
// }

// interface Field {
//     name: string;
//     doc?: string;
//     type: Schema;
//     default?: any;
//     order?: "ascending" | "descending" | "ignore";
// }

// interface RecordType {
//     type: "record" | "error";
//     name: string;
//     namespace?: string;
//     doc?: string;
//     aliases?: string[];
//     fields: Field[];
// }

// type Version = {
//     version: number,
//     schema?: Schema,
//     schemaID?: number,
//     [key: string]: any,
// }

// interface EnumType {
//     type: "enum";
//     name: string;
//     namespace?: string;
//     aliases?: string[];
//     doc?: string;
//     symbols: string[];
// }

export class Versions extends React.Component {
    state = { loading: true, rows: [], customCols: {cols: {}}, error: "", errorPrefix: "" }
    gridApi = null
    columnApi = null
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
        await this.loader.Load(this.fetchVersions)
    }

    componentWillUnmount() {
        this.loader.Abort()
    }

    fetchVersions = async (cancelToken) => {
        const data = await cancelToken.Fetch(`/api/schema-registry/versions/${this.props.match.params.subject}`)
        if (cancelToken.Aborted) return
        if (data.error) {
            this.setState({loading: false, error: data.error, errorPrefix: "Failed to fetch versions. Error: "})
            return
        }
        const results = data.map(r => (
            { version: r }))
        this.setState({ loading: false, rows: results })
        const customCols = {cols: {}}
        for (const version of results) {
            await this.fetchSchema(version, customCols, cancelToken)
            if (cancelToken.Aborted) return
        }
        this.setState({customCols})
    }

    async fetchSchema(version, customCols, cancelToken) {
        const data = await cancelToken.Fetch(`/api/schema-registry/schema/${this.props.match.params.subject}/${version.version}`)
        if (cancelToken.Aborted) return
        if (data.error) {
            this.setState({loading: false, error: data.error, errorPrefix: `Failed to fetch schema for version ${version.version}. Error: `})
            return
        }
        version.schema = data.schema
        version.schemaID = data.id
        this.addToRow(version, data.schema, customCols, "")
        if (this.gridApi) {
            this.gridApi.refreshCells()
        }
        this.forceUpdate();
    }

    addToRow = (row, record, customCols, prefix) => {
        if (record.fields === undefined) {
            return
        }
        for (const field of record.fields) {
            const name = `${prefix}${field.name}`
            const innerRecord = field.type 
            if (typeof innerRecord === "object" && innerRecord.type === "record") {
                this.addToRow(row, innerRecord, customCols, `${name}->`)
                continue
            }
            row[name] = this.getFieldValue(field)
            customCols.cols[name] = row[name]
        }
    }

    getFieldValue(field) {
        if (typeof field.type === "string") {
            return field.type
        }
        const enumType = field.type 
        if (enumType.type === "enum") {
            const symbols = enumType.symbols.join(`, `)
            return `${enumType.name} (${symbols})`
        }
        if (Array.isArray(field.type)) {
            const union = field.type.join(`, `)
            return `union{ ${union} }`
        }
        return `Unsupported Type`
    }

    getColumnDefs() {
        const cols = [
            { headerName: "Schema ID", field: "schemaID", filter: "agNumberColumnFilter" },
            { headerName: "Version", field: "version", filter: "agNumberColumnFilter" },
            { headerName: "Type", field: "schema.type" },
            { headerName: "Name", field: "schema.name" },
            { headerName: "Namespace", field: "schema.namespace" },
        ]
        this.addCustomColumns(cols, this.state.customCols.cols, ``)
        return cols
    }

    addCustomColumns = (cols, fields, prefix) => {
        for (const prop in fields) {
            const val = fields[prop]
            if (typeof val === 'object') {
                this.addCustomColumns(cols, val, `${prefix}${prop}.`)
            } else {
                const name = `${prefix}${prop}`
                cols.push({headerName: name, field: name})
            }
        }
    }

    render() {
        return (
            <>
                <KafkaToolbar
                    title={`Schemas for subject ${this.props.match.params.subject}`}
                    url={this.url}
                >
                </KafkaToolbar>
                {this.state.loading && <><CircularProgress /><div>Loading...</div></>}
                <ErrorMsg error={this.state.error} prefix={this.state.errorPrefix}></ErrorMsg>
                {!this.state.loading && <DataView
                    search={(r) => JSON.stringify(r.schema ?? "")}
                    rows={this.state.rows}
                    raw={this.state.rows.map(r => ({version: r.version, schema: r.schema}))}
                    url={this.url}
                    columnDefs={this.getColumnDefs()}
                    onGridReady={this.onGridReady}
                    >
                </DataView>}
            </>
        )
    }
}