import React, {useState} from "react";
import { Route, BrowserRouter as Router, Link } from 'react-router-dom'
import  Portfolios  from "./business/portfolios"
import  Topics  from "./business/topics"
import  Schemas  from "./business/schemas"
import  Algorithms  from "./business/algorithms"
import { GlobalThemeProvider } from "./components/theme_hook"
import GridContext  from './business/gridContext'
import "./style.css";


const App = () => {
	const [gridTopic, setGridTopic] = useState('')
	const gridUpdate = (obj) => {
		let {newTopic} = obj 
		setGridTopic(newTopic)
	}
	return (
		<GlobalThemeProvider>
			<GridContext.Provider value={{gridTopic, gridUpdate}} >
				<Router>
					<div>
						<Route path='/' exact component={Portfolios} />				
						<Route path="/topic/:topic"> <Topics/> </Route>
						<Route path="/schema/:schema"> <Schemas/> </Route>
						<Route path="/algorithm/:algorithm"> <Algorithms/> </Route>						
					</div>
				</Router>
			</GridContext.Provider>
		</GlobalThemeProvider>
	)
};
export default App;


