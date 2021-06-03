import React from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import { RouteComponentProps } from "react-router-dom";
import { CellProps, CellButton } from '../components/cell_button';
import { KafkaToolbar} from '../components/toolbar';
import { DataView} from '../components/data_view';
import { ErrorMsg} from '../components/error_msg';
import { Url } from "../components/url";
import { GetTopicResult, TopicOffsets } from "../shared/api";
import { History } from 'history';
import { CancelToken, Loader } from "../components/loader";

// type State = {
//     loading: boolean;
//     error?: string;
//     rows: Partition[];
// }

class ViewMessagesButton  {
    render() {
        return <CellButton getUrl={() => `/topic/messages/${this.props.data.topic}/${this.props.data.partition}`} {...this.props} />
    }
}

// type Partition = {
//     partition: number,
//     offset: string,
//     low: string,
//     high: string,
//     topic: string,
//     raw: TopicOffsets,
//     history: History<unknown>,
// }

export class Partitions extends React.Component  {
    state= { loading: true, rows: [], error: "" }
    url;
    loader = new Loader()

    constructor(props) {
        super(props);
        this.url = new Url(props.location.search, ``);
    }

    async componentDidMount() {
        await this.loader.Load(this.fetchPartitions)
    }

    componentWillUnmount() {
        this.loader.Abort()
    }

    fetchPartitions = async(cancelToken) => {
        const data = await cancelToken.Fetch(`/api/topic/${this.props.match.params.topic}`)
        if (cancelToken.Aborted) return
        if (data.error) {
            this.setState({loading: false, error: data.error })
            return
        }
        const results = data.offsets.map(r => {
            return { partition: r.partition, offset: r.offset, low: r.low, high: r.high, topic: this.props.match.params.topic, raw: r, history: this.props.history }
        })
        this.setState({ loading: false, rows: results })
    }

    getColumnDefs() {
        return [
            { headerName: "Partition", field: "partition", filter: "agNumberColumnFilter" },
            { headerName: "Offset", field: "offset", filter: "agNumberColumnFilter" },
            { headerName: "Low", field: "low", filter: "agNumberColumnFilter" },
            { headerName: "#Messages (High)", field: "high", filter: "agNumberColumnFilter", cellRendererFramework: ViewMessagesButton }
        ]
    }

    render() {
        return (
            <>
                <KafkaToolbar
                    title={`Partitions for topic: ${this.props.match.params.topic}`}
                    url={this.url}
                    hideSearch={true}
                >
                </KafkaToolbar>
                {this.state.loading && <><CircularProgress /><div>Loading...</div></>}
                <ErrorMsg error={this.state.error} prefix="Failed to fetch partitions. Error: "></ErrorMsg>
                {!this.state.loading && <DataView
                    search={_ => ""}
                    rows={this.state.rows}
                    raw={this.state.rows.map(r => ({topic: r.topic, ...r.raw}))}
                    url={this.url}
                    columnDefs={this.getColumnDefs()}>
                </DataView>}
            </>
        )
    }
}