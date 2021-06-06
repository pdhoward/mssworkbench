import React, {useState, useEffect, useContext} from "react";
import {useLocation} from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress';
import { KafkaToolbar} from '../components/toolbar';
import { DataView} from '../components/data_view';
import { RouteComponentProps } from "react-router-dom";
import { CellProps, CellButton } from'../components/cell_button_upgrade'
import { GridApi, ColumnApi, GridReadyEvent, ModuleRegistry } from 'ag-grid-community';
import { ErrorMsg} from '../components/error_msg';
import { Url } from "../components/url";
import { GetTopicResult, GetTopicsResult, TopicConsumerGroups, TopicOffsets, TopicsOffsets } from "../shared/api";
import { DescribeConfigResponse, ITopicMetadata } from "kafkajs";
import { History } from 'history';
import { CancelToken, Loader } from "../components/loader";
import GridContext from "./gridContext"


//////////////////example///////////////

const ViewPartitionsButton = () => {  
    return <CellButton getUrl={() => `/topic/partitions/${props.data.topic}`} {...props} />
}


const Topics = (props) => {    

    const [loading, setLoading] = useState(true)
    const [rows, setRows] = useState([])
    const [error, setError] = useState("")
    const [errorPrefix, setErrorPrefix] = useState("")    
    const [topic, setTopics] = useState(null)

    const {gridTopic} = useContext(GridContext)
   
    let gridApi = null;
    let columnApi = null;
    let location = useLocation() 
    let url = new Url(location.search, ``)
    let loader= new Loader();    

    let onGridReady = (params) => {        
        gridApi = params.api;
        columnApi = params.columnApi;
    }

    useEffect(() => {       
        async function getData() {           
            await loader.Load(fetchTopics)
        }
        getData();
     },[]);
    
    let fetchTopics = async (cancelToken = new CancelToken()) => {
        
        const data = await cancelToken.Fetch(`/api/topics/${gridTopic}`)
        if (cancelToken.Aborted) return
        if (data.error) {
            setLoading(false)
            setError(data.error)
            setErrorPrefix("Failed to fetch portfolios. Error: ")           
            return
        }       
        const results = data.topics.map(r => (
            { ...r,
              raw: r, 
              history: props.history } ))        
     
        setLoading(false)       
        setRows(results)     
    }

    let cellClick = props => {
        const cellValue = props.valueFormatted ? props.valueFormatted : props.value;        
        let url = `/topic/${cellValue}`
        return (
            "<a href='" + url + "' target='_blank'>" + cellValue + "</a>"
          );       
     }
    let cellRenderList = props => {
        const cellValue = props.valueFormatted ? props.valueFormatted : props.value;
        console.log(cellValue)
        let url = `/topic/${cellValue}`
        return (
            "<a href='" + url + "' target='_blank'>" + cellValue + "</a>"
            );       
     }
    
    const getColumnDefs = () => {
        return [
            { headerName: "Topic", field: "topic", cellRenderer: cellClick },
            { headerName: "Description", field: "topic_description", filter: "agTextColumnFilter" },
            { headerName: "Source Schemas", field: "source_schemas", filter: "agTextColumnFilter", cellRenderer: cellRenderList  },
            { headerName: "Target Schemas", field: "target_schemas", filter: "agTextColumnFilter", cellRenderer: cellRenderList},
           ]
    }
   
    return (
        <>
            <KafkaToolbar
                title="Portfolio"
                url={url}
            >
            </KafkaToolbar>
            {loading && <><CircularProgress /><div>Loading...</div></>}
            <ErrorMsg error={error} prefix={errorPrefix}></ErrorMsg>
            {!loading && <DataView
                search={(r) => r.topic}
                rows={rows}
                raw={rows.map(r => ({...r.raw}))}
                url={url}
                columnDefs={getColumnDefs()}
                onGridReady={onGridReady}
                >
            </DataView>}
        </>
    )
    
}

export default Topics