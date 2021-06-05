import React, {useState, useEffect} from "react";
import {Link, useLocation} from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress';
import { KafkaToolbar} from '../components/toolbar';
import { DataView} from '../components/data_view';
import { CellButton } from'../components/cell_button_upgrade'
import { GridApi, ColumnApi, GridReadyEvent, ModuleRegistry } from 'ag-grid-community';
import { ErrorMsg} from '../components/error_msg';
import { Url } from "../components/url";
import { CancelToken, Loader } from "../components/loader";


//////////////////example///////////////

const ViewPartitionsButton = () => {  
    return <CellButton getUrl={() => `/topic/partitions/${props.data.topic}`} {...props} />
}

const Portfolios = (props) => {
    console.log(`----portfolio line 20-------`)
    console.log(props)

    const [loading, setLoading] = useState(true)
    const [rows, setRows] = useState([])
    const [error, setError] = useState("")
    const [errorPrefix, setErrorPrefix] = useState("")
   
    let gridApi = null;
    let columnApi = null;  
    let location = useLocation  
    let url = new Url(location.search, ``)
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
    
    let fetchPortfolios = async (cancelToken = new CancelToken()) => {
        const data = await cancelToken.Fetch(`/api/portfolios`)
        if (cancelToken.Aborted) return
        if (data.error) {
            setLoading(false)
            setError(data.error)
            setErrorPrefix("Failed to fetch portfolios. Error: ")           
            return
        }       
        const results = data.portfolios.map(r => (
            { ...r,
              raw: r, 
              history: props.history } ))

        setLoading(false)       
        setRows(results)     
    }

    let cellClick = props => {
        const cellValue = props.valueFormatted ? props.valueFormatted : props.value;
        console.log(cellValue)
        let url = `/topic/${cellValue}`
        return (
            `<Link to=${url}></Link>`
          );         
     }

    const getColumnDefs = () => {
        return [
            { headerName: "Topic", field: "topic", cellRenderer: cellClick },
            { headerName: "Geo", field: "geography", filter: "agTextColumnFilter" },
            { headerName: "Division", field: "division", filter: "agTextColumnFilter" },
            { headerName: "Business Unit", field: "business_unit", filter: "agTextColumnFilter"},
            { headerName: "Business Process", field: "business_process", filter: "agTextColumnFilter" },
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

export default Portfolios