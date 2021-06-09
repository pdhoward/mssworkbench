
exports.algodata = [   
      {
        "$schema": "https://json-schema.org/draft-04/schema#",
        "id": "http://mynet.com/schemas/user.json#",
        "title": "Timeseries",
        "description": "Timeseries applied to sales trends",
        "type": "object",
        "properties": {
          "id": {
            "description": "positive integer or string of digits",
            "type": ["string", "integer"],
            "pattern": "^[1-9][0-9]*$",
            "minimum": 1
          },
          "name": { "type": "string", "maxLength": 128 },
          "rule": { "type": "string" },
          "equation": { "type": "string" }, 
         
          "createdAt": { "type": "string", "format": "date-time" }
        }
      }     
]