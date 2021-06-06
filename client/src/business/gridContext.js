import React, {createContext} from 'react'

const gridContext = createContext({topic: null, gridUpdate: () => {}})

export default gridContext