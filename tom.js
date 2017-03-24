// PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
// PREFIX gr: <http://purl.org/goodrelations/v1#>
// PREFIX ns0: <http://purl.org/goodrelations/v1#>
// PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
// SELECT ?Location ?shop ?name ?lat ?long ?day ?opens ?closes WHERE {
//     ?Offering a gr:Offering .
//     ?Offering gr:availableAtOrFrom ?Location .
//     ?Offering rdfs:label ?name .
//     ?Location a ns0:LocationOfSalesOrServiceProvisioning .
//     OPTIONAL {?Location rdfs:label ?shop}
//     ?Location geo:lat ?lat .
//     ?Location geo:long ?long .
//     OPTIONAL {?Location gr:hasOpeningHoursSpecification ?Hours}
//     OPTIONAL {?Hours gr:hasOpeningHoursDayOfWeek ?day}
//     OPTIONAL {?Hours gr:opens ?opens}
//     OPTIONAL {?Hours gr:closes ?closes}
//     FILTER(?name = 'ATM') .
// }
// LIMIT 700

let query = 
{
        'endpoint': 'sparql.data.southampton.ac.uk?output=json&show_inline=0&query='
        'prefix': [
                        {
                                'id':'rdfs:', 
                                'at':'<http://www.w3.org/2000/01/rdf-schema#>'
                        },
                        {
                                'id':'gr:', 
                                'at':'<http://purl.org/goodrelations/v1#>'
                        },
                        {
                                'id':'ns0:', 
                                'at':'<http://purl.org/goodrelations/v1#>'
                        },
                        {       
                                'id':'geo:', 
                                'at':'<http://www.w3.org/2003/01/geo/wgs84_pos#>'
                        }
                  ],
        'select': [
                        '?Location', '?shop', '?name', '?lat', '?long', '?day', '?opens', '?closes'
                  ],
        'where':  [
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
                                'type': 'STANDARD',
                                's': '?Offering',
                                'p': 'rdfs:label',
                                'o': '?name',
                                'cond': undefined
                        },
                        {
                                'type': 'STANDARD',
                                's': '?Location',
                                'p': 'rdfs:label',
                                'o': '?name',
                                'cond': undefined
                        }
                  ],
        'limit': 100
};