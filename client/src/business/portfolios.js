import React, {useState, useEffect, useContext} from "react";
import {useLocation} from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress';
import { KafkaToolbar} from '../components/toolbar';
import { DataView} from '../components/data_view';
import { ErrorMsg} from '../components/error_msg';
import { Url } from "../components/url";
import { CancelToken, Loader } from "../components/loader";
import GridContext from "./gridContext"


const Portfolios = (props) => {    
    const [gridApi, setGridApi] = useState(null)
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [loading, setLoading] = useState(true)
    const [rows, setRows] = useState([])
    const [error, setError] = useState("")
    const [errorPrefix, setErrorPrefix] = useState("")

    const {gridUpdate} = useContext(GridContext)   
    
    let location = useLocation()    
    let url = new Url(location.search, ``)
    let loader= new Loader();     
    

    let onGridReady = (params) => {        
       setGridApi(params.api)
       setGridColumnApi(params.columnApi)
       params.api.sizeColumnsToFit()
       
    }

    useEffect(() => {       

        async function getData() {           
            await loader.Load(fetchPortfolios)          
        }
      
        getData();
     },[]);
    
    let fetchPortfolios = async (cancelToken = new CancelToken()) => {
        let urlendpoint = ''
        if (window.location.hostname == 'localhost' ) {
            urlendpoint = `http://${'localhost:9999'}${'/api/portfolios'}`   
        } else {
            urlendpoint = 'https://mssworkbench.onrender.com/api/portfolios'  
        }
      
        const data = await cancelToken.Fetch(urlendpoint)
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

    const cellClick = (props) => {        
        const cellValue = props.valueFormatted ? props.valueFormatted : props.value; 
        gridUpdate({newTopic: cellValue})  
        let url = `/topic/${cellValue}`       
        return (
            "<a href='" + url + "' target='_blank'>" + cellValue + "</a>"
          );         
     }

    const cellRenderList = props => {
        const cellValue = props.valueFormatted ? props.valueFormatted : props.value;        
        let cellArray = []       
        if (typeof cellValue == 'string') {
            cellArray = cellValue.split(',')
        } else {
            cellArray = ["undefined"]
        }       
        let cellElements = cellArray.map(c => {
            let t = c.trim()
            return `<a href="/schema/${t}">${c}</a>`
        })      
        return (
            `<div>
                ${cellElements.map(c => c)}                
            </div>`           
        );       
     }
     const algoRenderList = props => {
        const cellValue = props.valueFormatted ? props.valueFormatted : props.value;        
        let cellArray = []       
        if (typeof cellValue == 'string') {
            cellArray = cellValue.split(',')
        } else {
            cellArray = ["undefined"]
        }       
        let cellElements = cellArray.map(c => {
            let t = c.trim()
            return `<a href="/algorithm/${t}">${c}</a>`
        })      
        return (
            `<div>
                ${cellElements.map(c => c)}                
            </div>`           
        );       
     }

    const getColumnDefs = () => {
        return [
            { headerName: "Topic", field: "topic", cellRenderer: cellClick },
            { headerName: "Geo", field: "geography", filter: "agTextColumnFilter" },
            { headerName: "Division", field: "division", filter: "agTextColumnFilter" },           
            { headerName: "Business Process", field: "business_process", filter: "agTextColumnFilter" },
            { headerName: "Sub Process", field: "sub_process", filter: "agTextColumnFilter" },
            { headerName: "Topic Descr.", field: "topic_description", filter: "agTextColumnFilter" },
            { headerName: "Source Schemas", field: "source_schemas", filter: "agTextColumnFilter", cellRenderer: cellRenderList  },
            { headerName: "Target Schemas", field: "target_schemas", filter: "agTextColumnFilter", cellRenderer: cellRenderList},
            { headerName: "Algorithms", field: "algorithms", filter: "agTextColumnFilter", cellRenderer: algoRenderList},
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