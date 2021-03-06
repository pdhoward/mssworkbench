import React from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import { KafkaToolbar} from '../components/toolbar';
import { DataView} from '../components/data_view';
import { RouteComponentProps } from "react-router-dom";
import { CellProps, CellButton } from '../components/cell_button';
import { GridApi, ColumnApi, GridReadyEvent } from 'ag-grid-community';
import { ErrorMsg} from '../components/error_msg';
import { Url } from "../components/url";
import { GetTopicResult, GetTopicsResult, TopicConsumerGroups, TopicOffsets, TopicsOffsets } from "../shared/api";
import { DescribeConfigResponse, ITopicMetadata } from "kafkajs";
import { History } from 'history';
import { CancelToken, Loader } from "../components/loader";

// type State = {
//     loading: boolean;
//     error?: string;
//     errorPrefix: string;
//     rows: Topic[];
// }

class ViewPartitionsButton  {
    render() {
        return <CellButton getUrl={() => `/topic/partitions/${this.props.data.topic}`} {...this.props} />
    }
}

class ViewConsumerGroupsButton  {
    render() {
        return <CellButton getUrl={() => `/topic/consumer_groups/${this.props.data.topic}`} {...this.props} />
    }
}

class ViewConfigsButton  {
    render() {
        return <CellButton getUrl={() => `/topic/configs/${this.props.data.topic}`} {...this.props} />
    }
}

class ViewMessagesButton  {
    render() {
        return <CellButton getUrl={() => `/topic/messages/${this.props.data.topic}`} {...this.props} />
    }
}

// type Topic = {
//     topic: string,
//     num_partitions: number,
//     raw: ITopicMetadata,
//     history: History<unknown>,
//     offsets?: TopicsOffsets,
//     config?: DescribeConfigResponse,
//     groups?: TopicConsumerGroups,
//     num_messages?: number,
//     num_groups?: number | `Unknown`,
//     num_configs?: number | `Unknown`,
// }

export class Topics extends React.Component  {
    state = { loading: true, rows: [], error: "", errorPrefix: "" }
    gridApi = null;
    columnApi = null;
    url;
    loader = new Loader();

    constructor(props) {
        super(props);
        this.url = new Url(props.location.search, ``);
    }

    onGridReady = (params) => {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
    }

    async componentDidMount() {
        await this.loader.Load(this.fetchTopics)
    }

    componentWillUnmount() {
        this.loader.Abort()
    }

    fetchTopics = async (cancelToken) => {
        const data = await cancelToken.Fetch(`/api/topics`)
        if (cancelToken.Aborted) return
        if (data.error) {
            this.setState({loading: false, error: data.error, errorPrefix: "Failed to fetch topics. Error: "})
            return
        }
        console.log(data)
        const results = data.topics.map((r) => (
            { topic: r.name, num_partitions: r.partitions.length, raw: r, history: this.props.history }))
        this.setState({ loading: false, rows: results })
        for (const topic of results) {
            await this.fetchTopic(topic, cancelToken)
            if (cancelToken.Aborted) return
        }
    }

    fetchTopic = async (topic, cancelToken) => {
        const data = await cancelToken.Fetch(`/api/topic/${topic.topic}`)
        if (cancelToken.Aborted) return
        if (data.error) {
            this.setState({loading: false, error: data.error, errorPrefix: `Failed to fetch topic ${topic.topic}. Error: `})
            return
        }
        let sum = 0
        for (const partition of data.offsets) {
            const high = parseInt(partition.high)
            sum += high
        }
        topic.offsets = data.offsets
        topic.config = data.config
        topic.groups = data.groups
        topic.num_messages = sum
        if (data.groups) {
            topic.num_groups = data.groups.length
        } else {
            topic.num_groups = `Unknown`
        }
        if (data.config) {
            topic.num_configs = data.config.resources[0].configEntries.length
        } else {
            topic.num_configs = `Unknown`
        }
        if (this.gridApi) {
            this.gridApi.refreshCells()
        }
        this.forceUpdate();
    }

    getColumnDefs() {
        return [
            { headerName: "Topic", field: "topic" },
            { headerName: "#Partitions", field: "num_partitions", filter: "agNumberColumnFilter", cellRendererFramework: ViewPartitionsButton },
            { headerName: "#Messages", field: "num_messages", filter: "agNumberColumnFilter", cellRendererFramework: ViewMessagesButton },
            { headerName: "#Consumer Groups", field: "num_groups", filter: "agNumberColumnFilter", cellRendererFramework: ViewConsumerGroupsButton },
            { headerName: "#Configs", field: "num_configs", filter: "agNumberColumnFilter", cellRendererFramework: ViewConfigsButton },
        ]
    }

    render() {
        return (
            <>
                <KafkaToolbar
                    title="Topics"
                    url={this.url}
                >
                </KafkaToolbar>
                {this.state.loading && <><CircularProgress /><div>Loading...</div></>}
                <ErrorMsg error={this.state.error} prefix={this.state.errorPrefix}></ErrorMsg>
                {!this.state.loading && <DataView
                    search={(r) => r.topic}
                    rows={this.state.rows}
                    raw={this.state.rows.map(r => ({...r.raw, num_messages: r.num_messages, offsets: r.offsets, config: r.config, groups: r.groups }))}
                    url={this.url}
                    columnDefs={this.getColumnDefs()}
                    onGridReady={this.onGridReady}
                    >
                </DataView>}
            </>
        )
    }
}