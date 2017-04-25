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

module.exports = {
    amenity : amenity,
    food : food,
    building : building
};


