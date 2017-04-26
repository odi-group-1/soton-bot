/**
 * Created by stefan on 24/03/17.
 */

let amenity = (searchCriteria, today) => {
    return {
        endpoint: 'http://sparql.data.southampton.ac.uk?output=json&show_inline=0&query=',
        prefix: [
            {
                id: 'rdfs:',
                at: '<http://www.w3.org/2000/01/rdf-schema#>'
            },
            {
                id: 'gr:',
                at: '<http://purl.org/goodrelations/v1#>'
            },
            {
                id: 'geo:',
                at: '<http://www.w3.org/2003/01/geo/wgs84_pos#>'
            }
        ],
        select: [ '?shop',
            '(SAMPLE (?name) AS ?shopName)',
            '(SAMPLE (?lat) AS ?shopLat)',
            '(SAMPLE (?long) AS ?shopLong)',
            '(SAMPLE (?openTime) AS ?shopOpenTime)',
            '(SAMPLE (?closeTime) AS ?shopCloseTime)' ],
        where: [
            {
                type: 'STANDARD',
                s: '?shop a gr:LocationOfSalesOrServiceProvisioning; rdfs:label ?name',
                p: '',
                o: ''
            },
            {
                type: 'STANDARD',
                s: '?offering gr:availableAtOrFrom ?shop; rdfs:label "'+searchCriteria+'"',
                p: '',
                o: ''
            },
            {
                type: 'OPTIONAL',
                s: '?shop geo:lat ?lat. ?shop geo:long ?long',
                p: '',
                o: ''
            },
            {
                type: 'OPTIONAL',
                s: '?shop gr:hasOpeningHoursSpecification ?openingHours. ?openingHours gr:hasOpeningHoursDayOfWeek gr:Monday; gr:opens ?openTime;',
                p: 'gr:closes ?closeTime',
                o: ''
            }
        ],
        group: '?shop',
        limit: 100
    }
};

let food = () => {
    return {
        endpoint: 'http://sparql.data.southampton.ac.uk?output=json&show_inline=0&query=',
        prefix: [
            {
                id: 'rdfs:',
                at: '<http://www.w3.org/2000/01/rdf-schema#>'
            },
            {
                id: 'geo:',
                at: '<http://www.w3.org/2003/01/geo/wgs84_pos#>'
            },
            {
                id: 'ns:',
                at: '<http://id.southampton.ac.uk/ns/>'
            }
        ],
        select: [ '*' ],
        where: [
            {
                type: 'STANDARD',
                s: '?Business',
                p: 'a',
                o: 'ns:FoodOrDrinkEstablishment'
            },
            {
                type: 'STANDARD',
                s: '?Business',
                p: 'geo:lat',
                o: '?lat'
            },
            {
                type: 'STANDARD',
                s: '?Business',
                p: 'geo:long',
                o: '?long'
            },
            {
                type: 'STANDARD',
                s: '?Business',
                p: 'rdfs:label',
                o: '?name'
            }
        ],
        limit: 10000
    };
};

let building = (buildingId) => {
  return {
      endpoint: 'http://sparql.data.southampton.ac.uk?output=json&show_inline=0&query=',
      select: [ '*' ],
      where: [
          {
              type: 'STANDARD',
              s: '?s',
              p: '?p',
              o: '?o'
          },
          {
              type: 'FILTER',
              cond: '?s = <http://id.southampton.ac.uk/building/'+buildingId+'> '+
              '&& (?p = <http://www.w3.org/2003/01/geo/wgs84_pos#lat> '+
              '|| ?p = <http://www.w3.org/2003/01/geo/wgs84_pos#long>)'
          }
      ]
  }
};

let room = (room) => {
    return {
        endpoint: 'http://sparql.data.southampton.ac.uk?output=json&show_inline=0&query=',
        prefix: [
            {
                id: 'located:',
                at: '<http://data.ordnancesurvey.co.uk/ontology/spatialrelations/>'
            },
            {
                id: 'rooms:',
                at: '<http://vocab.deri.ie/rooms#>'
            },
            {
                id: 'rdf:',
                at: '<http://www.w3.org/2000/01/rdf-schema#>'
            },
            {
                id: 'purl:',
                at: '<http://purl.org/openorg/>'
            },
            {
                id: 'skos:',
                at: '<http://www.w3.org/2004/02/skos/core#>'
            },
            {
                id: 'foaf:',
                at: '<http://xmlns.com/foaf/0.1/>'
            },
            {
                id: 'rm:',
                at: '<http://id.southampton.ac.uk/room/>'
            }
        ],
        select: [ '?room',
            '(SAMPLE (?building) AS ?roomBuilding)',
            '(SAMPLE (?type) AS ?roomType)',
            '(SAMPLE (?access) AS ?roomAccess)',
            '(SAMPLE (?notation) AS ?roomNotation)',
            '(SAMPLE (?img) AS ?roomImage)',
            '(SAMPLE (?capacity) AS ?roomCapaciy)'
        ],
        where: [
            {
                type: 'STANDARD',
                s: '?room',
                p: 'a',
                o: 'rooms:Room'
            },
            {
                type: 'STANDARD',
                s: '?room',
                p: 'located:within',
                o: '?building'
            },
            {
                type: 'STANDARD',
                s: '?room',
                p: 'rdf:label',
                o: '?type'
            },
            {
                type: 'STANDARD',
                s: '?room',
                p: 'purl:access',
                o: '?access'
            },
            {
                type: 'STANDARD',
                s: '?room',
                p: 'skos:notation',
                o: '?notation'
            },
            {
                type: 'STANDARD',
                s: '?room',
                p: 'purl:capacity',
                o: '?capacity'
            },
            {
                type: 'STANDARD',
                s: '?img',
                p: 'foaf:depicts',
                o: '?room'
            },
            {
                type: 'FILTER',
                cond: '?room = rm:' + room
            }
        ],
        group: '?room'
    };
};

let freeRoom = (dateSt, dateEnd, dateNow) => {
    return {
        endpoint: 'http://sparql.data.southampton.ac.uk?output=json&show_inline=0&query=',
        prefix: [
            {
                id: 'soton:',
                at: '<http://id.southampton.ac.uk/ns/>'
            },
            {
                id: 'rdfs:',
                at: '<http://www.w3.org/2000/01/rdf-schema#>'
            },
            {
                id: 'event:',
                at: '<http://purl.org/NET/c4dm/event.owl#>'
            },
            {
                id: 'timeline:',
                at: '<http://purl.org/NET/c4dm/timeline.owl#>'
            },
            {
                id: 'xsd:',
                at: '<http://www.w3.org/2001/XMLSchema#>'
            },
            {
                id: 'skos:',
                at: '<http://www.w3.org/2004/02/skos/core#>'
            },
            {
                id: 'foaf:',
                at: '<http://xmlns.com/foaf/0.1/>'
            },
            {
                id: 'semweb:',
                at: '<http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#>'
            },
            {
                id: 'purl:',
                at: '<http://purl.org/openorg/>'
            }
        ],
        select: [ 'DISTINCT', '?room', '?roomNumber', '?img', '?capacity',
            '(group_concat(?start) as ?starts)',
            '(group_concat(?end) as ?ends)'
        ],
        where: [
            {
                type: 'STANDARD',
                s: '?event',
                p: 'a',
                o: 'soton:RoomBookedEvent'
            },
            {
                type: 'STANDARD',
                s: '?event',
                p: 'event:place',
                o: '?room'
            },
            {
                type: 'STANDARD',
                s: '?event',
                p: 'rdfs:label',
                o: '?label'
            },
            {
                type: 'STANDARD',
                s: '?event',
                p: 'event:time',
                o: '?time'
            },
            {
                type: 'STANDARD',
                s: '?time',
                p: 'timeline:start',
                o: '?start'
            },
            {
                type: 'STANDARD',
                s: '?time',
                p: 'timeline:end',
                o: '?end'
            },
            {
                type: 'FILTER',
                cond: "?start >= '" + dateSt + "'^^xsd:dateTime && ?start < '" + dateEnd + "'^^xsd:dateTime && ?end > '" + dateNow + "'^^xsd:dateTime"
            },
            {
                type: 'STANDARD',
                s: 'GRAPH <http://id.southampton.ac.uk/dataset/room-features/latest>{',
                p: '?room skos:notation ?roomNumber;',
                o: 'purl:capacity ?capacity. }'
            },
            {
                type: 'STANDARD',
                s: 'GRAPH <http://id.southampton.ac.uk/dataset/photos/latest>{',
                p: '?img foaf:depicts ?room; semweb:width "192"^^xsd:integer; semweb:height "144"^^xsd:integer .',
                o: "FILTER regex(str(?img),'B.jpg$','i')}"
            }
        ],
        group: '?room ?img ?capacity ?roomNumber',
        limit: 10000
    };
};

module.exports = {
    amenity : amenity,
    food : food,
    building : building,
    room : room,
    freeRoom : freeRoom
};


