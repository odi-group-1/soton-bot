/**
 * Created by stefan on 24/03/17.
 */

let result = "" +
    "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>"+
    "PREFIX gr: <http://purl.org/goodrelations/v1#>"+
    "SELECT ?Location ?Name"+
    "WHERE {"+
    "?Offering a gr:Offering ."+
    "?Offering gr:availableAtOrFrom	?Location ."+
    "?Offering rdfs:label ?Name ."+
    "FILTER (?Name = \"Alcohol\") ."+
    "}";


let query =
    {
        endpoint : 'sparql.data.southampton.ac.uk?output=json&show_inline=0&query=',
        prefix : [
            {
                'id':'rdfs:',
                'at':'<http://www.w3.org/2000/01/rdf-schema#>'
            },
            {
                'id':'gr:',
                'at':'<http://www.w3.org/2000/01/rdf-schema#>'
            }
        ],
        select : [ '?Location',  '?Name' ],
        where :  [
            {
                'type': 'STANDARD',
                's': '?Offering',
                'p': 'a',
                'o': 'gr:Offering',
                'cond': undefined
            },
            {
                'type': 'STANDARD',
                's': '?Offering',
                'p': 'gr:availableAtOrFrom',
                'o': '?Location',
                'cond': undefined
            },
            {
                'type': 'FILTER',
                's': '?Offering',
                'p': 'gr:availableAtOrFrom',
                'o': '?Location',
                'cond': ' = \"Alcohol\"'
            },

    ],
        limit: 100
};

