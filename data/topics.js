

 ////////////////////////////fake schemas/////////////////////
exports.topics = [{
    id: "0001",      
    topic: 'acctsales',
    topic_description: 'major account sales',
    source_schemas: [Order, Product, Customer],
    target_schemas: []    
  },
  {
    id: "0002",    
    topic: 'geosales',
    topic_description: 'aggregate sales by geography',
    source_schemas: [Order, Product, Customer],
    target_schemas: [] 
  },
  {
    id: "0003",   
    topic: 'totalsales',
    topic_description: 'total sales by business unit',
    source_schemas: [Order, Product],
    target_schemas: [] 
  },
  {
    id: "0004",   
    topic: 'salesrep',
    topic_description: 'Top 100 sales reps',
    source_schemas: [Order, Product],
    target_schemas: [] 
  },
  {
    id: "0005",    
    topic: 'productsales',
    topic_description: 'total sales by product',
    source_schemas: [Order, Product],
    target_schemas: [] 
  }
]