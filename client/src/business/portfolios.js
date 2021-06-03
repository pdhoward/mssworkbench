import React, {useState, useEffect} from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import { KafkaToolbar} from '../common/toolbar';
import { DataView} from '../common/data_view';
import { RouteComponentProps } from "react-router-dom";
const { CellProps, CellButton } = require('../common/cell_button_upgrade')
import { GridApi, ColumnApi, GridReadyEvent, ModuleRegistry } from 'ag-grid-community';
import { ErrorMsg} from '../common/error_msg';
import { Url } from "../common/url";
import { GetTopicResult, GetTopicsResult, TopicConsumerGroups, TopicOffsets, TopicsOffsets } from "../../shared/api";
import { DescribeConfigResponse, ITopicMetadata } from "kafkajs";
import { History } from 'history';
import { CancelToken, Loader } from "../common/loader";

// type State = {
//     loading: boolean;
//     error?: string;
//     errorPrefix: string;
//     rows: Portfolio[];
// }

//////////////////////////////learning/////////////////

const ViewPartitionsButton = () => {  
    return <CellButton getUrl={() => `/topic/partitions/${props.data.topic}`} {...props} />
}

const ViewConsumerGroupsButton = () => {    
    return <CellButton getUrl={() => `/topic/consumer_groups/${props.data.topic}`} {...props} />  
}

const ViewConfigsButton = () =>{  
    return <CellButton getUrl={() => `/topic/configs/${props.data.topic}`} {...props} />  
}

const ViewMessagesButton = () => {   
    return <CellButton getUrl={() => `/topic/messages/${props.data.topic}`} {...props} />
}

// type Portfolio = {
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

const Portfolios = (props) => {

    const [loading, setLoading] = useState(true)
    const [rows, setRows] = useState([])
    const [error, setError] = useState("")
    const [errorPrefix, setErrorPrefix] = useState("")
   
    let gridApi = null;
    let columnApi = null;
    let url = new Url(props.location.search, ``)
    let loader= new Loader();    

    let onGridReady = (params) => {
        gridApi = params.api;
        columnApi = params.columnApi;
    }

    useEffect(() => {
        async function getData() {
            await loader.Load(fetchPortfolios)
        }
        getData();
     },[]);
    

    let fetchPortfolios = async (cancelToken) => {
        const data = await cancelToken.Fetch(`/api/portfolios`)
        if (cancelToken.Aborted) return
        if (data.error) {
            setLoading(false)
            setError(data.error)
            setErrorPrefix("Failed to fetch portfolios. Error: ")
           
            return
        }
        console.log(data)
        const results = data.topics.map(r => (
            { topic: r.name,
              num_partitions: r.partitions.length, 
              raw: r, 
              history: props.history } ))
        setLoading(false)
        setRows(results)
       
        for (const topic of results) {
            await fetchPortfolio(topic, cancelToken)
            if (cancelToken.Aborted) return
        }
    }

    const fetchPortfolio = async (topic, cancelToken) => {
        const data = await cancelToken.Fetch(`/api/topic/${topic.topic}`)
        if (cancelToken.Aborted) return
        if (data.error) {
            setLoading(false)
            setError(data.error)
            setErrorPrefix(`Failed to fetch topic ${topic.topic}. Error: `)           
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
        forceUpdate();
    }

    const getColumnDefs = () => {
        return [
            { headerName: "Topic", field: "topic" },
            { headerName: "#Partitions", field: "num_partitions", filter: "agNumberColumnFilter", cellRendererFramework: ViewPartitionsButton },
            { headerName: "#Messages", field: "num_messages", filter: "agNumberColumnFilter", cellRendererFramework: ViewMessagesButton },
            { headerName: "#Consumer Groups", field: "num_groups", filter: "agNumberColumnFilter", cellRendererFramework: ViewConsumerGroupsButton},
            { headerName: "#Configs", field: "num_configs", filter: "agNumberColumnFilter", cellRendererFramework: ViewConfigsButton },
        ]
    }
   
    return (
        <>
            <KafkaToolbar
                title="Topics"
                url={url}
            >
            </KafkaToolbar>
            {loading && <><CircularProgress /><div>Loading...</div></>}
            <ErrorMsg error={error} prefix={errorPrefix}></ErrorMsg>
            {loading && <DataView
                search={(r) => r.topic}
                rows={rows}
                raw={rows.map(r => ({...r.raw, num_messages: r.num_messages, offsets: r.offsets, config: r.config, groups: r.groups }))}
                url={url}
                columnDefs={getColumnDefs()}
                onGridReady={onGridReady}
                >
            </DataView>}
        </>
    )
    
}

module.exports = Portfolios