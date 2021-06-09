import React, {useState, useEffect, useContext} from "react";
import {useLocation} from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress';
import { KafkaToolbar} from '../components/toolbar';
import { DataView} from '../components/data_view';
import { ErrorMsg} from '../components/error_msg';
import { Url } from "../components/url";
import { CancelToken, Loader } from "../components/loader";
import GridContext from "./gridContext"

const Algorithms = (props) => {    
    const [gridApi, setGridApi] = useState(null)
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [loading, setLoading] = useState(true)
    const [rows, setRows] = useState([])
    const [error, setError] = useState("")
    const [errorPrefix, setErrorPrefix] = useState("")

    let location = useLocation()

    const {gridUpdate} = useContext(GridContext)    
    
    const getTopic = thePath => thePath.substring(thePath.lastIndexOf('/') + 1)
        
    let url = new Url(location.search, ``)
    let loader= new Loader();    

    let onGridReady = (params) => {        
       setGridApi(params.api)
       setGridColumnApi(params.columnApi)
       params.api.sizeColumnsToFit()
       
    }

    useEffect(() => {
        async function getData() {           
            await loader.Load(fetchAlgorithms)          
        }
        getData();
     },[]);
    
    let fetchAlgorithms = async (cancelToken = new CancelToken()) => {
        
        let topic = getTopic(location.pathname)       
        let t = topic.trim()
        let urlendpoint = ''
        if (window.location.hostname == 'localhost' ) {
            urlendpoint = `http://${'localhost:9999'}${'/api/algorithms/'}`   
        } else {
            urlendpoint = `https://mssworkbench.onrender.com/api/algorithms/` 
        }
        let opts = {}
        opts.segment = t        
        const data = await cancelToken.Fetch(urlendpoint, opts) 
        
        if (cancelToken.Aborted) return
        if (data.error) {
            setLoading(false)
            setError(data.error)
            setErrorPrefix("Failed to fetch schemas. Error: ")           
            return
        }       
        const results = data.map(r => (
            { ...r,
              raw: r, 
              history: props.history } ))

        setLoading(false)       
        setRows(results)     
    }    

    const getColumnDefs = () => {
        return [
            { headerName: "Title", field: "title"},
            { headerName: "Description", field: "description", filter: "agTextColumnFilter" },
            { headerName: "Version", field: "$schema", filter: "agTextColumnFilter" }
        ]}
        
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

export default Algorithms